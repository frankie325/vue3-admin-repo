export interface Cache<V = any> {
  value?: V;
  timeoutId?: ReturnType<typeof setTimeout>;
  time?: number;
  alive?: number;
}

const NOT_ALIVE = 0;

/**
 * @description: 设置项目中的各种缓存，都在cache对象中
 * 为什么不直接存储在本地？
 * cache相当于一个暂存区，先将项目的各种缓存先暂存到cache对象中，最后再将所有缓存一次性存入到本地
 */
export class Memory<T = any, V = any> {
  // 缓存的值类型为 Cache<V>
  private cache: { [key in keyof T]?: Cache<V> } = {};
  private alive: number;

  constructor(alive = NOT_ALIVE) {
    // Unit second
    this.alive = alive * 1000; //默认缓存时间
    this.cache = {};
  }

  get getCache() {
    return this.cache;
  }

  setCache(cache: { [key in keyof T]?: Cache<V> }) {
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

    // 经过一段时间后则清空缓存
    item.timeoutId = setTimeout(
      () => {
        this.remove(key);
      },
      expire > now ? expire - now : expire, // 这里使用三目是因为，防止expire过大，超出setTimeout的最大延迟毫秒数
    );
  }

  // 移除缓存
  remove<K extends keyof T>(key: K) {
    const item = this.get(key);
    Reflect.deleteProperty(this.cache, key);
    if (item) {
      clearTimeout(item.timeoutId!);
      return item.value;
    }
  }

  // 更新缓存
  resetCache(cache: { [K in keyof T]?: Cache<V> }) {
    Object.keys(cache).forEach((key) => {
      const k = key as keyof T;
      const item = cache[k];
      if (item && item.time) {
        const now = new Date().getTime(); //当前时间
        const expire = item.time; //过期时间
        // 还没有超过期时间，才会重新设置缓存值
        if (expire > now) {
          this.set(k, item.value!, expire);
        }
      }
    });
  }

  // 清空缓存
  clear() {
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key as keyof T];
      item?.timeoutId && clearTimeout(item.timeoutId);
    });
    this.cache = {};
  }
}
