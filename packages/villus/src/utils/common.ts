import { computed, isReactive, isRef, Ref, unref } from 'vue';
import { MaybeLazyOrRef, QueryVariables, QueryPredicateOrSignal, MaybeRef } from '../types';

export function toWatchableSource<T = any>(value: MaybeLazyOrRef<T> | Record<string, any>): Ref<T> {
  return computed(() => {
    return unwrap(value);
  });
}

export function unravel<TVars = QueryVariables>(skip: QueryPredicateOrSignal<TVars>, vars: MaybeRef<TVars>) {
  if (isRef(skip)) {
    return skip.value;
  }

  return skip(unref(vars));
}

export function unwrap<TValue>(val: MaybeLazyOrRef<TValue>) {
  if (isRef(val)) {
    return unref(val);
  }

  // TODO: typescript bug to fix here
  return typeof val === 'function' ? (val as any)() : val;
}

export function isWatchable<T>(val: unknown): val is MaybeLazyOrRef<T> {
  return isRef(val) || isReactive(val) || typeof val === 'function';
}
