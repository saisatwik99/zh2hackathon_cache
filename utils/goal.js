import got from "got";

const getTotalNavValue = async (totalNav) => {
    const response = await got(`https://api.mfapi.in/mf/147888`);
    const data = await JSON.parse(response.body);
    return totalNav*data.data[0].nav;
}

const getNavValue = async () => {
    const response = await got(`https://api.mfapi.in/mf/147888`);
    const data = await JSON.parse(response.body);
    return data.data[0].nav;
}

export default {
    getTotalNavValue,
    getNavValue
}
