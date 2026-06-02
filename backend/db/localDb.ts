import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection<T>(collection: string): T[] {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (error) {
    console.error(`Error reading collection ${collection}:`, error);
    return [];
  }
}

export function writeCollection<T>(collection: string, data: T[]): void {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing collection ${collection}:`, error);
  }
}

export const dbCollections = {
  getCollection<T>(name: string) {
    return {
      find(filter?: (item: T) => boolean): T[] {
        const items = readCollection<T>(name);
        if (filter) {
          return items.filter(filter);
        }
        return items;
      },
      findOne(filter: (item: T) => boolean): T | null {
        const items = readCollection<T>(name);
        return items.find(filter) || null;
      },
      insertOne(item: T): T {
        const items = readCollection<T>(name);
        items.push(item);
        writeCollection<T>(name, items);
        return item;
      },
      updateOne(filter: (item: T) => boolean, update: Partial<T>): T | null {
        const items = readCollection<T>(name);
        const idx = items.findIndex(filter);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...update };
          writeCollection<T>(name, items);
          return items[idx];
        }
        return null;
      },
      updateAll(filter: (item: T) => boolean, update: Partial<T>): number {
        const items = readCollection<T>(name);
        let updatedCount = 0;
        const newItems = items.map(item => {
          if (filter(item)) {
            updatedCount++;
            return { ...item, ...update };
          }
          return item;
        });
        if (updatedCount > 0) {
          writeCollection<T>(name, newItems);
        }
        return updatedCount;
      },
      deleteOne(filter: (item: T) => boolean): boolean {
        const items = readCollection<T>(name);
        const idx = items.findIndex(filter);
        if (idx !== -1) {
          items.splice(idx, 1);
          writeCollection<T>(name, items);
          return true;
        }
        return false;
      }
    };
  }
};
