import { jest } from '@jest/globals';
import { DataModel } from './DataModel.mjs';

// A simple mock entry class with clone support
class MockEntry extends DataModel {
  constructor(id, value) {
    super();
    this.id = id;
    this.value = value;
  }
}

describe('DataModel Base Class', () => {

  beforeEach(() => {
    // Reset data source before each test
    MockEntry.setDataSource([]);
  });

  //
  // ---------------------------------------------------------
  // setDataSource
  // ---------------------------------------------------------
  //
  it('sets the data source correctly', () => {
    const data = [new MockEntry(1, 'A')];
    MockEntry.setDataSource(data);

    expect(MockEntry.data).toBe(data);
  });

  //
  // ---------------------------------------------------------
  // select
  // ---------------------------------------------------------
  //
  it('throws when selecting without initialised data source', () => {
    MockEntry.data = null;

    expect(() => MockEntry.select()).toThrow('Data source not initialised.');
  });

  it('returns all cloned entries when no filter is provided', () => {
    const data = [new MockEntry(1, 'A'), new MockEntry(2, 'B')];
    MockEntry.setDataSource(data);

    const result = MockEntry.select();

    expect(result).toHaveLength(2);
    expect(result[0]).not.toBe(data[0]); // clone check
    expect(result[0]).toEqual(data[0]);
  });

  it('returns filtered cloned entries when filter is provided', () => {
    const data = [
      new MockEntry(1, 'A'),
      new MockEntry(2, 'B'),
      new MockEntry(3, 'A')
    ];
    MockEntry.setDataSource(data);

    const result = MockEntry.select(e => e.value === 'A');

    expect(result).toHaveLength(2);
    expect(result.map(e => e.id)).toEqual([1, 3]);
  });

  //
  // ---------------------------------------------------------
  // update
  // ---------------------------------------------------------
  //
  it('throws when updating without initialised data source', () => {
    MockEntry.data = null;

    expect(() => MockEntry.update(() => true, new MockEntry(99, 'X')))
      .toThrow('Data source not initialised.');
  });

  it('throws when update filter is not a function', () => {
    expect(() => MockEntry.update('not-a-function', {}))
      .toThrow('Filter must be a predicate function.');
  });

  it('updates matching entries and returns count', () => {
    const data = [
      new MockEntry(1, 'A'),
      new MockEntry(2, 'B'),
      new MockEntry(3, 'A')
    ];
    MockEntry.setDataSource(data);

    const updated = new MockEntry(999, 'Z');

    const count = MockEntry.update(e => e.value === 'A', updated);

    expect(count).toBe(2);
    expect(MockEntry.data[0].id).toBe(999);
    expect(MockEntry.data[2].id).toBe(999);
  });

  it('returns 0 when no entries match update filter', () => {
    const data = [new MockEntry(1, 'A')];
    MockEntry.setDataSource(data);

    const updated = new MockEntry(999, 'Z');

    const count = MockEntry.update(e => e.value === 'NOPE', updated);

    expect(count).toBe(0);
    expect(MockEntry.data[0].id).toBe(1);
  });

  //
  // ---------------------------------------------------------
  // insert
  // ---------------------------------------------------------
  //
  it('throws when inserting without initialised data source', () => {
    MockEntry.data = null;

    expect(() => MockEntry.insert(new MockEntry(1, 'A')))
      .toThrow('Data source not initialised.');
  });

  it('inserts a cloned entry into the data source', () => {
    MockEntry.setDataSource([]);

    const entry = new MockEntry(1, 'A');
    MockEntry.insert(entry);

    expect(MockEntry.data).toHaveLength(1);
    expect(MockEntry.data[0]).not.toBe(entry); // clone check
    expect(MockEntry.data[0]).toEqual(entry);
  });

  //
  // ---------------------------------------------------------
  // delete
  // ---------------------------------------------------------
  //
  it('throws when deleting without initialised data source', () => {
    MockEntry.data = null;

    expect(() => MockEntry.delete(() => true))
      .toThrow('Data source not initialised.');
  });

  it('throws when delete filter is not a function', () => {
    expect(() => MockEntry.delete('not-a-function'))
      .toThrow('Filter must be a predicate function.');
  });

  it('deletes matching entries and returns count', () => {
    const data = [
      new MockEntry(1, 'A'),
      new MockEntry(2, 'B'),
      new MockEntry(3, 'A')
    ];
    MockEntry.setDataSource(data);

    const count = MockEntry.delete(e => e.value === 'A');

    expect(count).toBe(2);
    expect(MockEntry.data).toHaveLength(1);
    expect(MockEntry.data[0].id).toBe(2);
  });

  it('returns 0 when no entries match delete filter', () => {
    const data = [new MockEntry(1, 'A')];
    MockEntry.setDataSource(data);

    const count = MockEntry.delete(e => e.value === 'NOPE');

    expect(count).toBe(0);
    expect(MockEntry.data).toHaveLength(1);
  });

  //
  // ---------------------------------------------------------
  // clone
  // ---------------------------------------------------------
  //
  it('clone returns a new object with same properties', () => {
    const entry = new MockEntry(1, 'A');
    const cloned = entry.clone();

    expect(cloned).not.toBe(entry);
    expect(cloned).toEqual(entry);
    expect(Object.getPrototypeOf(cloned)).toBe(Object.getPrototypeOf(entry));
  });
});
