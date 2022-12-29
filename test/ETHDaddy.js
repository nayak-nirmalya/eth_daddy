const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (token) => {
  return ethers.utils.parseUnits(token.toString(), 'ether')
}

describe('ETHDaddy', () => {
  let ethDaddy

  beforeEach(async () => {
    const ETHDaddy = await ethers.getContractFactory('ETHDaddy')
    ethDaddy = await ETHDaddy.deploy('ETH Daddy', 'ETHD')
  })

  it('should have a name', async () => {
    const result = await ethDaddy.name()
    expect(result).to.equal('ETH Daddy')
  })

  it('should have a symbol', async () => {
    const result = await ethDaddy.symbol()
    expect(result).to.equal('ETHD')
  })
})
