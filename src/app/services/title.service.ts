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
      this.titleService.setTitle(event['title'] || 'Menumaker : Create Menu for Family Occasions');
      this.meta.updateTag({ name: 'description', content: event['description'] || 'Create customized menus for any family occasion. Choose dishes by meal time, create and download your personalized menu.' });
      this.meta.updateTag({ name: 'keywords', content: event['keywords'] || 'Menu, Family Occasion, Dishes, Meal Time, Personalized Menu, Download Menu' });
    });
  }
}
