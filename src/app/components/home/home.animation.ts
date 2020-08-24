import {
  trigger,
  transition,
  style,
  query,
  animateChild,
  group,
  animate,
} from '@angular/animations';

function slide(from: string, to: string, direction: string) {
  return transition(from + ' => ' + to, [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ left: direction == 'right' ? '100%' : '-100%' })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate(
          '100ms ease-in',
          style({ left: direction == 'right' ? '-100%' : '100%' })
        ),
      ]),
      query(':enter', [animate('100ms ease-in', style({ left: '0%' }))]),
    ]),
    query(':enter', animateChild()),
  ]);
}

export const slideInAnimation = trigger('routeAnimations', [
  slide('ChatsPage', 'FriendsPage', 'right'),
  slide('ChatsPage', 'UserPage', 'right'),
  slide('FriendsPage', 'ChatsPage', 'left'),
  slide('FriendsPage', 'UserPage', 'right'),
  slide('UserPage', 'ChatsPage', 'left'),
  slide('UserPage', 'FriendsPage', 'left'),
]);
