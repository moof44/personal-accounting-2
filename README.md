# PersonalAccounting2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Description

This is accounting for personal use designed for multi-earning personnel

## GOAL

This project has the following GOAL:
1. To create a higly performance Angular web application
2. To create a user interface compatible with mobile
3. To make it responsive and user experience friendly
4. To pass the highest score possible for light house
5. For actual personal usage

## Research and Development

It was observed that Angular suggest the following features:

### Features

1. Installed with Angular-SSR
2. Installed with Angular-PWA / Service Worker
3. Implemented component and service inheritance - application of DRY principles
4. Implemented reusable components - reduced redundancy by 70%
5. Batch save, update and delete of firestore
6. Firebase function implementation

### Problems encountered

1. Firebase high cost of read and write;
Solution: Request data read in a global so it won't need to be refetch everytime

## NOTE
If this is being viewed for code review for applications, this repository is just a remake from the previous: https://github.com/moof44/personal-accounting 
The difference is the use of SSR and PWA altogether and the application to use signal and storeSignal.
