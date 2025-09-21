// import { NgModule } from '@angular/core';
// import { ServerModule } from '@angular/platform-server';
// import { provideServerRoutesConfig } from '@angular/ssr';
// import { AppComponent } from './app.component';
// import { AppModule } from './app.module';
// import { serverRoutes } from './app.routes.server';

// @NgModule({
//   imports: [AppModule, ServerModule],
//   providers: [provideServerRoutesConfig(serverRoutes)],
//   bootstrap: [AppComponent],
// })
// export class AppServerModule {}


import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
// Server-side rendering (SSR) support using `@angular/ssr` is optional.
// If you want SSR, install `@angular/ssr` and uncomment the imports below.
// import { provideServerRoutesConfig } from '@angular/ssr';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
// import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  // providers: [provideServerRoutesConfig(serverRoutes)],
  bootstrap: [AppComponent]
})
export class AppServerModule { }
