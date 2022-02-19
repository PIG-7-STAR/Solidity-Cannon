// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from '@graphprotocol/graph-ts';

export class ProtocolPublish extends ethereum.Event {
  get params(): ProtocolPublish__Params {
    return new ProtocolPublish__Params(this);
  }
}

export class ProtocolPublish__Params {
  _event: ProtocolPublish;

  constructor(event: ProtocolPublish) {
    this._event = event;
  }

  get name(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get version(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get url(): string {
    return this._event.parameters[2].value.toString();
  }

  get owner(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class CannonRegistry extends ethereum.SmartContract {
  static bind(address: Address): CannonRegistry {
    return new CannonRegistry('CannonRegistry', address);
  }

  getProtocols(): Array<Bytes> {
    const result = super.call('getProtocols', 'getProtocols():(bytes32[])', []);

    return result[0].toBytesArray();
  }

  try_getProtocols(): ethereum.CallResult<Array<Bytes>> {
    const result = super.tryCall(
      'getProtocols',
      'getProtocols():(bytes32[])',
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    const value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  getVersions(_protocolName: Bytes): Array<Bytes> {
    const result = super.call('getVersions', 'getVersions(bytes32):(bytes32[])', [
      [ethereum.Value.fromFixedBytes(_protocolName)]
    );

    return result[0].toBytesArray();
  }

  try_getVersions(_protocolName: Bytes): ethereum.CallResult<Array<Bytes>> {
    const result = super.tryCall(
      'getVersions',
      'getVersions(bytes32):(bytes32[])',
      [ethereum.Value.fromFixedBytes(_protocolName)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    const value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }
}

export class PublishCall extends ethereum.Call {
  get inputs(): PublishCall__Inputs {
    return new PublishCall__Inputs(this);
  }

  get outputs(): PublishCall__Outputs {
    return new PublishCall__Outputs(this);
  }
}

export class PublishCall__Inputs {
  _call: PublishCall;

  constructor(call: PublishCall) {
    this._call = call;
  }

  get _name(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _version(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _url(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class PublishCall__Outputs {
  _call: PublishCall;

  constructor(call: PublishCall) {
    this._call = call;
  }
}
