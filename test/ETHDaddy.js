const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (token) => {
  return ethers.utils.parseUnits(token.toString(), 'ether')
}

describe('ETHDaddy', () => {
  let ethDaddy, deployer, owner
  const CONTRACT_NAME = 'ETHDaddy'
  const NAME = 'ETH Daddy'
  const SYMBOL = 'ETHD'

  beforeEach(async () => {
    // Set-Up Accounts
    ;[deployer, owner] = await ethers.getSigners()

    // Deploy Contract
    const ETHDaddy = await ethers.getContractFactory(CONTRACT_NAME)
    ethDaddy = await ETHDaddy.deploy(NAME, SYMBOL)

    // List a Domain
    const transaction = await ethDaddy
      .connect(deployer)
      .list('nirmalya.eth', tokens(10))
    await transaction.wait()
  })

  describe('Deployment', () => {
    it('should have a name', async () => {
      const result = await ethDaddy.name()
      expect(result).to.equal('ETH Daddy')
    })

    it('should have a symbol', async () => {
      const result = await ethDaddy.symbol()
      expect(result).to.equal('ETHD')
    })

    it('should set the owner', async () => {
      const result = await ethDaddy.owner()
      expect(result).to.equal(deployer.address)
    })

    it('should check for maxSupply', async () => {
      const result = await ethDaddy.maxSupply()
      expect(result).to.equal(1)
    })

    it('should check for totalSupply', async () => {
      const result = await ethDaddy.totalSupply()
      expect(result).to.equal(0)
    })
  })

  describe('Domain', () => {
    it('should return domain attributes', async () => {
      const domain = await ethDaddy.getDomain(1)
      expect(domain.name).to.be.equal('nirmalya.eth')
      expect(domain.cost).to.be.equal(tokens(10))
      expect(domain.isOwned).to.be.equal(false)
    })

    it('should revert with "Not Owner!" if anyone except owner calls the list function', async () => {
      await expect(
        ethDaddy.connect(owner).list('nirmalya.eth', tokens(10)),
      ).to.be.revertedWith('Not Owner!')
    })
  })

  describe('Minting', () => {
    const ID = 1
    const AMOUNT = tokens(10)

    beforeEach(async () => {
      const transaction = await ethDaddy.connect(owner).mint(ID, {
        value: AMOUNT,
      })
      await transaction.wait()
    })

    it(`shlould update the owner`, async () => {
      const ownerOfAddress = await ethDaddy.ownerOf(ID)
      expect(ownerOfAddress).to.be.equal(owner.address)
    })

    it(`shlould update the domain status`, async () => {
      const domain = await ethDaddy.getDomain(ID)
      expect(domain.isOwned).to.be.equal(true)
    })

    it('should update the contract balance', async () => {
      const result = await ethDaddy.getBalance()
      expect(result).to.be.equal(AMOUNT)
    })

    it('should check for totalSupply after minting', async () => {
      const result = await ethDaddy.totalSupply()
      expect(result).to.equal(1)
    })

    it(`should revert with "ID Can't be 0." if ID is 0`, async () => {
      await expect(
        ethDaddy.connect(owner).mint(0, {
          value: AMOUNT,
        }),
      ).to.be.revertedWith("ID Can't be 0.")
    })

    it(`should revert with "Invalid ID!" if ID > maxSupply`, async () => {
      await expect(
        ethDaddy.connect(owner).mint(6, {
          value: AMOUNT,
        }),
      ).to.be.revertedWith('Invalid ID!')
    })

    it(`should revert with "Domain Already Owned!" if someone tries to buy already minted domain`, async () => {
      await expect(
        ethDaddy.connect(owner).mint(1, {
          value: AMOUNT,
        }),
      ).to.be.revertedWith('Domain Already Owned!')
    })

    it(`should revert with "Not Enough ETH!" if msg.value is not enough`, async () => {
      const transaction = await ethDaddy
        .connect(deployer)
        .list('nirmalya.eth', tokens(10))
      await transaction.wait()
      await expect(
        ethDaddy.connect(owner).mint(2, {
          value: tokens(5),
        }),
      ).to.be.revertedWith('Not Enough ETH!')
    })
  })

  describe('Withdraw', () => {
    const ID = 1
    const AMOUNT = tokens(10)
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await ethDaddy.connect(owner).mint(ID, {
        value: AMOUNT,
      })
      await transaction.wait()

      transaction = await ethDaddy.connect(deployer).withdraw()
      await transaction.wait()
    })

    it(`should revert with message "Not Owner!" if anyone except owner tries to withdraw fund`, async () => {
      await expect(ethDaddy.connect(owner).withdraw()).to.be.revertedWith(
        'Not Owner!',
      )
    })

    it('should update the contract owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('should empty smart contract balance', async () => {
      const balanceOfContract = await ethDaddy.getBalance()
      expect(balanceOfContract).to.be.equal(0)
    })
  })
})
