class PeerService {
    peer: any;
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:stun1.l.google.com:19302',
                            'stun:stun2.l.google.com:19302'
                        ]
                    }
                ]
            })
        }
    }

    async getAnswer(offer: any) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));  // ans set as local description
            return ans;
        }
    }

    async setLocalDescription(ans: any) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();    // offer created
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));  // offer set as local description
            return offer;
        }
    }

}

export default new PeerService();