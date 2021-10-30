# Install Hyperledger Besu

Besu is an Etherium client for enterprise applications. We will focus on a Linux installation.

### Prerequisites

First you need to install java 11 on your computer.
```bash
sudo apt-get install openjdk-11-jdk
```

## Starting Node 1

Fisrt go to the `node1` directory and run :
```bash
../besu/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all"
```

## Starting Node 2

Fisrt go to the `node2` directory and run :
```bash
../besu/bin/besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://081519ebf93c0e2d7abc80763619c94a2afddce160f365fc765f1c4821d2ada2c1b5d7f3b438b4804b1428a4969eb3ea404c853adb76a28bccd8723724077ec8@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546
```

## Starting Node 3

Fisrt go to the `node3` directory and run :
```bash
 ../besu/bin/besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://cdea9cb71c43d1d14db651ada2dff0175f0b9daeb68dc45089bf43bf0516678b1261813c521a1fa10376a929cee552aa15fabe3062ac6b136eebed2b4a87cfa4@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547
```

## Starting Node 4

Fisrt go to the `node4` directory and run :
```bash
../besu/bin/besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://cdea9cb71c43d1d14db651ada2dff0175f0b9daeb68dc45089bf43bf0516678b1261813c521a1fa10376a929cee552aa15fabe3062ac6b136eebed2b4a87cfa4@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548
```

From there you have created 4 validators node. You can easly see witch one is currently validating the last block.

