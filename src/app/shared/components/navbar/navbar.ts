import { Component, inject, signal } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {

  router = inject(Router);

  pageTitle = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    // tap(event => console.log(event)),
    map(event => event.url),
    map(url => routes.find(route => `/${route.path}` === url)?.title ?? 'Mapas')
  ))

  routes = routes.map(route => ({
    path: route.path,
    title: `${route.title ?? 'Map en Angular'}`,
  }))




}
