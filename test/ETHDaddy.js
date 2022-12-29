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
  })
})
