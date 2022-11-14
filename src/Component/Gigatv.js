//! [x] write an onclick function on iframe to control mute
//! [x] remove title and youtube watermark in the videos
//! [x] redeploy contract
//! [x] start playing on load
//! [x] add some style to the input tag and buttons
//! [x] add a header
//! [x] remote styling
//! [] deploy
//! [x] add a alert on page load to login into wallet
//https://coolors.co/272932-4d7ea8-828489-9e90a2-b6c2d9
import React from 'react';
import style from './Gigatv.module.css';
import ReactPlayer from 'react-player'
import { getAllLinks, isOwner, mintToken, changeTokenURI } from './tron';

let links = []
const sleep = ms => new Promise(r => setTimeout(r, ms));

class GigaTv extends React.Component {

    state = {
        isOwner: true,
        openAddLinkModal: false,
        openUpdateLinkModal: false,
        muted: {}
    }


    mintChannel = async (lin) => {
        await mintToken(lin)
        this.state.openAddLinkModal = false;
        this.forceUpdate();
    }
    updateChannel = async (idx, link) => {
        let owner = await isOwner(idx)

        if (owner === window.tronWeb.defaultAddress.hex) {
            let out = await changeTokenURI(idx, link);
            if (out) {
                alert("link changed");
                window.location.reload();
            }
        }
        else {
            alert("You are not the owner!")
        }
        this.state.openUpdateLinkModal = false;
        this.forceUpdate();
    }

    async componentDidMount() {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        await sleep(500)
        let arr;

        try {

            arr = await getAllLinks()

        }
        catch {

            alert('Login to TronLink wallet  and change to nile testnet');
            var obj = setInterval(async () => {
                if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                    clearInterval(obj)
                    var tronweb = window.tronWeb
                }
            }, 10)
        }

        for (let i = 0; i < arr.length; i++) {
            links.push(arr[i].link)
        }

        if (links.length < 10) {
            for (let i = arr.length; i <= 4; i++) {
                links.push("https://vimeo.com/274184554")
            }

        }
        this.forceUpdate()
    }

    async handleClickMint(e) {
        document.getElementById("oba").classList.add("bright")
        await sleep(500)
        document.getElementById("oba").classList.remove("bright")
        this.forceUpdate()
    }

    async handleClickUpdate(e) {
        document.getElementById("oba").classList.add("bright")
        await sleep(500)
        document.getElementById("oba").classList.remove("bright")
        this.state.openUpdateLinkModal = true;
        this.forceUpdate();
    }

    render() {

        let val = "";
        let channelNum = ""
        let muted = false;
        return (
            <div className={style.gigatv} >
                <header>
                    <h1>GIGA &nbsp; TRON &nbsp; TV</h1>
                </header>
                {
                    this.state.openAddLinkModal &&
                    <div className={style.modal}>
                        <div className={style.modalcontent}>
                            <h3>MINT CHANNEL</h3>
                            <div className={style.mint}>

                                <input placeholder='Enter channel link to mint' type="text" onChange={(e) => { this.val = e.target.value; }} />
                                <div className={style.modalButtons}>

                                    <button className={style.continue} onClick={() => this.mintChannel(this.val)}>MINT</button>
                                    <button className={style.cancel} onClick={() => this.setState({ openAddLinkModal: false })}>CLOSE</button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.openUpdateLinkModal &&
                    <div className={style.modal}>
                        <div className={style.modalcontent}>
                            <h3>UPDATE CHANNEL</h3>
                            <div className={style.mint}>
                                <input placeholder='Enter channel number to update' type="text" onChange={(e) => { this.channelNum = e.target.value; }} />
                                <input placeholder='Enter channel link to update' type="text" onChange={(e) => { this.val = e.target.value; }} />
                                <div className={style.modalButtons}>
                                    <button className={style.continue} onClick={() => this.updateChannel(this.channelNum, this.val)}>UPDATE</button>
                                    <button className={style.cancel} onClick={() => this.setState({ openUpdateLinkModal: false })}>CLOSE</button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                <div className={style.header}>
                    <h2 className={style.remote}>TV Remote</h2>
                    <div className="pult">
                        <div id="oba" className="block title obazhure"></div>
                        <div className="block block-navigate">
                            <button type="button" style={{ fontSize: "12.5px", width: "35%" }} onClick={async () => { await this.handleClickMint(); this.setState({ openAddLinkModal: true }); }} className="btn top-navigate text dwork">MINT</button>
                            {
                                <button type="button" style={{ fontSize: "12.5px", width: "35%" }} onClick={async () => { await this.handleClickUpdate(); this.setState({ openUpdateLinkModal: true }); }} className="btn top-navigate text dwork">Update</button>
                            }
                        </div>
                    </div>
                </div>

                <main>
                    <div className={style.channelcontainer}>
                        {
                            links.map((link, index) => {
                                return (
                                    //
                                    <div className={style.channel}>
                                        <ReactPlayer loop={true} width={"500px"} height={"100%"} muted playing url={link} config={{ youtube: { playerVars: { disablekb: 1 } } }} />
                                        <p><a href={`#${index}`} >View Channel {index + 1}</a></p>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div>
                        {
                            links.map((link, index) => {
                                return (
                                    <div className={style.iframecontainer} key={index} id={index}>
                                        <ReactPlayer loop={true} id={"iframe" + String(index)} width={"100%"} height={"360px"} playing
                                            onClick={

                                                () => {
                                                    this.setState(prevState => ({
                                                        muted: {
                                                            ...prevState.muted,
                                                            [index]: !this.state.muted[index]
                                                        }
                                                    }))
                                                }
                                            }
                                            muted={this.state.muted[index]}
                                            url={link} config={{ youtube: { playerVars: { disablekb: 1 } } }} />
                                        {<div style={{ width: "100%" }} align="center">
                                            Channel {index + 1}
                                        </div>}
                                    </div>
                                )
                            })
                        }
                    </div>

                </main>
            </div>)
    }
}

export default GigaTv;