let contractAddress = "TX9gabrLzeAy3Bm5pxSinoVqryWSKepuXx";

export async function mintToken(link) {

    if (!isValidHttpUrl(link)) {
        alert("not a Valid link");
        return;
    }
    let Contract = await window.tronWeb.contract().at(contractAddress);

    if (await Contract.isMinter(window.tronWeb.defaultAddress.base58)) {
    }
    else {
        await Contract.addMinter(window.tronWeb.defaultAddress.base58).send()
    }

    let te = await getAllLinks();
    let number;
    if (te.length > 0) {
        let last_te = te[te.length - 1]
        number = parseInt(last_te.index._hex, 16)
    }
    else {
        number = 0
    }
    try {
        let out = await Contract.mintWithTokenURI(window.tronWeb.defaultAddress.base58, number + 1, link).send()
    }
    catch {
        alert("user denied")
        return
    }

    alert("Channel minted");
    window.location.reload();
}

export async function getAllLinks() {
    let Contract = await window.tronWeb.contract().at(contractAddress);

    let totalSupply = await Contract.totalSupply().call();
    let arr = []

    for (let i = 0; i < totalSupply; i++) {
        arr.push(await Contract.tokenByIndex(i).call());
    }

    let arrLinks = [];

    for (let j = 0; j < arr.length; j++) {
        if (isValidHttpUrl(await Contract.tokenURI(arr[j]).call())) { //! change to valid url
            arrLinks.push({
                index: arr[j],
                link: await Contract.tokenURI(arr[j]).call()
            })
        }
    }
    return arrLinks;
}

function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

export async function isOwner(index) {
    let Contract = await window.tronWeb.contract().at(contractAddress);
    return Contract.ownerOf(index).call();
}

export async function changeTokenURI(index, link) {
    let Contract = await window.tronWeb.contract().at(contractAddress);

    return Contract.changeTokenURI(window.tronWeb.defaultAddress.base58, index, link).send();
}