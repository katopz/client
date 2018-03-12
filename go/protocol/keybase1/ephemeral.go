// Auto-generated by avdl-compiler v1.3.22 (https://github.com/keybase/node-avdl-compiler)
//   Input file: avdl/keybase1/ephemeral.avdl

package keybase1

import (
	"github.com/keybase/go-framed-msgpack-rpc/rpc"
)

type EkGeneration int64

func (o EkGeneration) DeepCopy() EkGeneration {
	return o
}

type DeviceEkMetadata struct {
	Kid        KID          `codec:"kid" json:"device_ephemeral_dh_public"`
	HashMeta   HashMeta     `codec:"hashMeta" json:"hash_meta"`
	Generation EkGeneration `codec:"generation" json:"generation"`
}

func (o DeviceEkMetadata) DeepCopy() DeviceEkMetadata {
	return DeviceEkMetadata{
		Kid:        o.Kid.DeepCopy(),
		HashMeta:   o.HashMeta.DeepCopy(),
		Generation: o.Generation.DeepCopy(),
	}
}

type DeviceEk struct {
	Seed       Bytes32      `codec:"seed" json:"seed"`
	Generation EkGeneration `codec:"generation" json:"generation"`
	HashMeta   HashMeta     `codec:"hashMeta" json:"hash_meta"`
}

func (o DeviceEk) DeepCopy() DeviceEk {
	return DeviceEk{
		Seed:       o.Seed.DeepCopy(),
		Generation: o.Generation.DeepCopy(),
		HashMeta:   o.HashMeta.DeepCopy(),
	}
}

type EphemeralInterface interface {
}

func EphemeralProtocol(i EphemeralInterface) rpc.Protocol {
	return rpc.Protocol{
		Name:    "keybase.1.ephemeral",
		Methods: map[string]rpc.ServeHandlerDescription{},
	}
}

type EphemeralClient struct {
	Cli rpc.GenericClient
}
