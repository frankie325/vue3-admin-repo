export interface Cache<V = any> {
  value?: V;
  timeoutId?: ReturnType<typeof setTimeout>;
  time?: number;
  alive?: number;
}

const NOT_ALIVE = 0;

/**
 * @description: 设置短时期内的缓存
 */
export class Memory<T = any, V = any> {
  // 缓存的值类型为 Cache<V>
  private cache: { [key in keyof T]?: Cache<V> } = {};
  private alive: number;

  constructor(alive = NOT_ALIVE) {
    // Unit second
    this.alive = alive * 1000;
  }

  get getCache() {
    return this.cache;
  }

  setCache(cache) {
    this.cache = cache;
  }

  get<K extends keyof T>(key: K) {
    return this.cache[key];
  }

  set<K extends keyof T>(key: K, value: V, expire?: number) {
    let item = this.get(key);

    // 如果过期时间没有或者小于0，则使用alive
    if (!expire || (expire as number) <= 0) {
      expire = this.alive;
    }

    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
        item.timeoutId = undefined;
      }
      // 如果在cache中存在，则更新value值
      item.value = value;
    } else {
      item = { value, alive: expire };
      this.cache[key] = item;
    }

    if (!expire) {
      return value;
    }

    const now = new Date().getTime();

    // expire过大，大于现在，则使用expire作为过期时间
    item.time = expire > now ? expire : now + expire; //更新过期时间

    // 到达过期时间则清空缓存
    item.timeoutId = setTimeout(
      () => {
        this.remove(key);
      },
      expire > now ? expire - now : expire, // 这里使用三目是因为，防止expire过大，超出setTimeout的最大延迟毫秒数
    );
  }

  remove<K extends keyof T>(key: K) {}
}
