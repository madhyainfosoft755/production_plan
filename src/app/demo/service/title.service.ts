import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(event => {
        // const pageTitle = event['title'] ? `${event['title']} | Unbrako` : 'Unbrako | Production Plan';
      this.titleService.setTitle(event['title'] ? `Unbrako | ${event['title']}` : 'Unbrako | Production Plan');
      this.meta.updateTag({ name: 'description', content: event['description'] || 'Procustion Plan and reporting application.' });
    //   this.meta.updateTag({ name: 'keywords', content: event['keywords'] || '' });
    });
  }
}
