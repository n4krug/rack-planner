import YAML from 'yaml';
import { promises as fs } from 'fs';
import Icon from '@mdi/react';
import * as SI from '@icons-pack/react-simple-icons'
import { mdiEthernet, mdiAudioInputXlr, mdiVideoInputSvideo } from '@mdi/js';
import { createElement } from 'react';
import Lines from './lines'

const icons = {
  rj45: mdiEthernet,
  xlr: mdiAudioInputXlr,
  speakon: mdiVideoInputSvideo
}

export default async function Racks() {
  const file = await fs.readFile(process.cwd() + '/app/test.yaml', 'utf8');

  const racks = YAML.parse(file);
  console.log(racks)

  return (
    <div className="grid gap-8">
      { Object.keys(racks).map(rack => {
          return <Rack name={ rack } data={ racks[rack] } />
        })
      }
  </div>
  );
}

function Rack({name, data}) {
  let used_slots = 0;
  data.servers.map(server => {
    used_slots += server.units;
  });

  return (
    <>
    <div className={`grid grid-cols-1 gap-3 bg-gray-800 p-4 rounded-lg min-w-lg items-center text-center`} style={{ gridTemplateRows: `1fr repeat(${data.size}, 4rem)` }}>
      <h1>{name}</h1>
      { data.servers.map((server, index) => {
          return <Server data={server} index={index} />
        })
      }
      { [...Array(data.size-used_slots)].map((x, i) =>{
        return (<div className="self-stretch bg-gray-900 rounded-lg"></div>);
      })}
    </div>
    {data.connections ? <Lines lines={data.connections}/> : <></>}
    </>
  );
}

function Server({data, index, split=false}) {
  // console.log(data)
  
  const base_server_style = { gridRow: `span ${data.units}` };

  if (data.servers) {
      
    return (
      <div className={`grid grid-rows-1 grid-cols-${data.servers.length} gap-3 self-stretch`} style={{gridTemplateColumns: `repeat(${data.servers.length}, 1fr)`}}>
        { data.servers.map((server, index) => {
          return <Server data={server} index={index} split={true} />
        })}
      </div>
    );
  }

  const color_server_style = data.color ? { backgroundColor: data.color } : {};
  const server_style = Object.assign({}, base_server_style, color_server_style);

  return (
    <div className={`p-3 bg-gray-700 rounded-lg content-center self-stretch grid grid-cols-[4rem_1fr] grid-rows-2`} style={server_style} >
      <div className="items-center justify-center flex" style={{gridRow: "span 2"}} >  
        { data.icon && SI["Si" + data.icon] ? 
          createElement(SI["Si" + data.icon], { style: { color: data.icon_color ? data.icon_color : "white"} })
        : <></> }
      </div>
      <h2 className="text-left">{data.name}</h2>
      <div className="flex justify-end items-center gap-1">
        {data.ports ? data.ports.map((port, idx) => {
          return ( <div id={ data.id + "-" + idx } >
                    <Icon path={ icons[port.type] } size={1} style={{ color: port.color || "white" }} />
                    { // port.label ? <i className="text-xs">{port.label}</i> : <></> }
                    }
                  </div>)
        }) : <></>}
      </div>
    </div>
  );
}
