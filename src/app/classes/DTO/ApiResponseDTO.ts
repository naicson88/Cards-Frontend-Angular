export class ApiResponseDTO {
    httpHeaders: any;
	httpStatusCode:number;
	message:string;
	data:any;
	otherParams: Map<string, object>;
}