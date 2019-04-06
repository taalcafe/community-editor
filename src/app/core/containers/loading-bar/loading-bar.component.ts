import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  show = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    let asyncLoadCount = 0;
    this.router.events.pipe(untilDestroyed(this)).subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          asyncLoadCount++;
        } else if (event instanceof RouteConfigLoadEnd || event instanceof NavigationEnd) {
          asyncLoadCount--;
        }

        asyncLoadCount = Math.max(0, asyncLoadCount);
        this.show = Boolean(asyncLoadCount);
        this.cdr.detectChanges();
      }
    );
  }

  ngOnDestroy() {}
}
