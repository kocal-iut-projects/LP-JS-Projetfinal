import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Article} from "../article";
import "rxjs/add/operator/toPromise";
import {Author} from "../author";

@Injectable()
export class AdminApiService {

  private API_URL = 'http://localhost:3000';

  constructor(private http: Http) {
  }

  public createArticle(body: any): Promise<number> {
    return this.http.post(`${this.API_URL}/articles`, body)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  public getAuthors(): Promise<Author[]> {
    return this.http.get(`${this.API_URL}/authors`)
      .toPromise()
      .then(this.extractData)
      .then(authors => authors.map(a => new Author(a.id, a.firstname, a.lastname)))
      .catch(this.handleError)
  }

  public getAuthor(author_id: number): Promise<Author> {
    return this.http.get(`${this.API_URL}/authors/${author_id}`)
      .toPromise()
      .then(this.extractData)
      .then(a => new Author(a.id, a.firstname, a.lastname, a.articles_id.split('||')))
      .catch(this.handleError)
  }

  public getArticles(): Promise<Article[]> {
    return this.http.get(`${this.API_URL}/articles`)
      .toPromise()
      .then(this.extractData)
      .then(articles => articles.map(a =>
        new Article(a.id, a.title, a.body, a.created_by, a.created_at, a.updated_by, a.updated_at, a.tags.split('||'))
      ))
      .catch(this.handleError)
  }

  public getArticle(article_id: number): Promise<Article> {
    return this.http.get(`${this.API_URL}/articles/${article_id}`)
      .toPromise()
      .then(this.extractData)
      .then(a => new Article(
        a.id, a.title, a.body,
        new Author(a.author_id, a.author_firstname, a.author_lastname),
        a.created_at,
        a.updated_by,
        a.updated_at, a.tags.split('||'))
      )
      .catch(this.handleError)
  }

  public deleteArticle(article_id: number): Promise {
    return this.http.delete(`${this.API_URL}/articles/${article_id}`)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public getTags(): Promise<string[]> {
    return this.http.get(`${this.API_URL}/tags`)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  public getArticlesByTag(tag: string): Promise<any> {
    return this.http.get(`${this.API_URL}/tags/${tag}`)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res: Response) {
    let body = res.json()
    return body.data || []
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
