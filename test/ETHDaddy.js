const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (token) => {
  return ethers.utils.parseUnits(token.toString(), 'ether')
}

describe('ETHDaddy', () => {
  it('has a name', async () => {
    const ETHDaddy = await ethers.getContractFactory('ETHDaddy')
    let ethDaddy = await ETHDaddy.deploy('ETH Daddy', 'ETHD')

    let result = await ethDaddy.name()
    expect(result).to.equal('ETH Daddy')

    result = await ethDaddy.symbol()
    expect(result).to.equal('ETHD')
  })
})
