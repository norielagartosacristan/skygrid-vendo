import api from "./api";

export function getBridges(){

    return api.get("/bridges");

}

export function createBridge(data:any){

    return api.post("/bridges",data);

}

export function deleteBridge(id:string){

    return api.delete("/bridges/"+id);

}