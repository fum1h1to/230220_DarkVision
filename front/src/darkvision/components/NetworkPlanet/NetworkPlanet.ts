import * as THREE from 'three';
import { EARTH_RADIUS } from '../../constant';
import { LatLng } from '../../models/LatLng';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Earth } from '../Earth/Earth';
import { Flow } from '../Flow/Flow';

export class NetworkPlanet {
  private parentScene: THREE.Scene;
  private readonly PACKET_GOAL: LatLng = { lat: 35, lng: 140 };
  private flowPacketWS: FlowPacketWebSocket;
  private flowPacketList: Flow[] = [];
  private flowPacketNum: number = 0;
  private earth: Earth;

  constructor(scene: THREE.Scene) {
    this.parentScene = scene;
    this.earth = new Earth(scene, EARTH_RADIUS, new THREE.Vector3(0, 0, 0));

    scene.add(this.earth.mesh);

    this.flowPacketWS = new FlowPacketWebSocket();


    const flow = new Flow(
      this.flowPacketNum,
      this.parentScene,
      { lat: 0, lng: 0 },
      this.PACKET_GOAL,
      EARTH_RADIUS,
      4,
      4,
    );
    this.flowPacketNum += 1;
    flow.create();
    
  }

  public update() {
    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      const flowPacketList = this.flowPacketWS.getFlowPacketList().slice(0, 50);
      flowPacketList.map((flowPacket) => {
        const now = this.flowPacketNum;
        this.flowPacketNum += 1;
        const flow = new Flow(
          now,
          this.parentScene,
          flowPacket.from,
          this.PACKET_GOAL,
          EARTH_RADIUS,
          3,
          4,
        );
        flow.create();
      });
    }
  }

}