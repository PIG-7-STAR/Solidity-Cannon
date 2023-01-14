//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IUUPSImplementation.sol";
import "./ProxyStorage.sol";

abstract contract UUPSImplementation is IUUPSImplementation, ProxyStorage {
  error ZeroAddress();
  error NotAContract(address);
  error NoChange();

  /**
   * @inheritdoc IUUPSImplementation
   */
  function simulateUpgradeTo(address newImplementation) public override {
    ProxyStore storage store = _proxyStore();

    store.simulatingUpgrade = true;

    address currentImplementation = store.implementation;
    store.implementation = newImplementation;

    (bool rollbackSuccessful, ) = newImplementation.delegatecall(abi.encodeCall(this.upgradeTo, (currentImplementation)));

    if (!rollbackSuccessful || _proxyStore().implementation != currentImplementation) {
      revert UpgradeSimulationFailed();
    }

    store.simulatingUpgrade = false;

    // solhint-disable-next-line reason-string
    revert();
  }

  /**
   * @inheritdoc IUUPSImplementation
   */
  function getImplementation() external view override returns (address) {
    return _proxyStore().implementation;
  }

  function _upgradeTo(address newImplementation) internal virtual {
    if (newImplementation == address(0)) {
      revert ZeroAddress();
    }

    if (!_isContract(newImplementation)) {
      revert NotAContract(newImplementation);
    }

    ProxyStore storage store = _proxyStore();

    if (newImplementation == store.implementation) {
      revert NoChange();
    }

    if (!store.simulatingUpgrade && _implementationIsSterile(newImplementation)) {
      revert ImplementationIsSterile(newImplementation);
    }

    store.implementation = newImplementation;

    emit Upgraded(address(this), newImplementation);
  }

  function _implementationIsSterile(address candidateImplementation) internal virtual returns (bool) {
    (bool simulationReverted, bytes memory simulationResponse) = address(this).delegatecall(
      abi.encodeCall(this.simulateUpgradeTo, (candidateImplementation))
    );

    return
      !simulationReverted &&
      keccak256(abi.encodePacked(simulationResponse)) == keccak256(abi.encodePacked(UpgradeSimulationFailed.selector));
  }

  function _isContract(address account) internal view returns (bool) {
    uint256 size;

    assembly {
      size := extcodesize(account)
    }

    return size > 0;
  }
}