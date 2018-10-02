import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ConversationService {

  private headers: Headers;
  private reqOptions: RequestOptions;

  private refreshHeaders(){
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append("X-IBM-Client-Id", "default");
    this.headers.append("X-IBM-Client-Secret", "SECRET");
  }

  constructor(private http: Http) {
      this.refreshHeaders();
   }

   fetchItineraryDetails(payload): Promise<any>{
     let POST_URL: string = environment.API_BASE_URL + "/Bookings/itinerary";
     if(!payload || !payload.params){
         return Promise.reject("INVALID DATA");
     }else{
         this.reqOptions = new RequestOptions({headers: this.headers});
         return this.http.post(POST_URL, payload, this.reqOptions)
         .toPromise()
         .then(this.extractData)
               .catch(this.handleErrorPromise);
     }
   }

  callConversationMock(payload): Promise<any>{
      return this.http.get('../../assets/conversation_response.json')
      .toPromise()
      .then(this.extractData)
            .catch(this.handleErrorPromise);
  }

   callConversation(payload): Promise<any>{
     let POST_URL: string = environment.API_BASE_URL + "/Conversations/converse";
     if(!payload || !payload.params || (!payload.params.input && !payload.params.context.initConversation)){
         return Promise.reject("INVALID DATA");
     }else{
         this.reqOptions = new RequestOptions({headers: this.headers});
         return this.http.post(POST_URL, payload, this.reqOptions)
         .toPromise()
         .then(this.extractData)
               .catch(this.handleErrorPromise);
     }
   }

   bookItinerary(payload): Promise<any>{
     let POST_URL: string = environment.API_BASE_URL + "/Bookings/itinerary/book";
     if(!payload || !payload.params){
         return Promise.reject("INVALID DATA");
     }else{
         this.reqOptions = new RequestOptions({headers: this.headers});
         return this.http.post(POST_URL, payload, this.reqOptions)
         .toPromise()
         .then(this.extractData)
               .catch(this.handleErrorPromise);
     }
   }

   private extractData(res: Response) {
         let body = res.json();
         return body;
   }

   private handleErrorPromise (error: Response | any) {
 	     console.error(error.message || error);
        return Promise.reject(error.message || error);
   }

}
