/**
 * this plugin adds the checkAdapter-function to rxdb
 * you can use it to check if the given adapter is working in the current environmet
 */
import PouchDB from '../pouch-db';
import {
    generateId,
    adapterObject
} from '../util';

export async function checkAdapter(adapter) {
    const id = 'rxdb-test-adapter-' + generateId();
    let recoveredDoc = null;
    let pouch;
    try {
        pouch = new PouchDB(
            id,
            adapterObject(adapter), {
                auto_compaction: false, // no compaction because this only stores local documents
                revs_limit: 1
            }
        );
        await pouch.info(); // ensure that we wait until db is useable
        await pouch.put({
            _id: id,
            value: true
        });
        recoveredDoc = await pouch.get(id);

        // cleanup
        await pouch.remove(recoveredDoc);
    } catch (err) {
        return false;
    }

    if (recoveredDoc && recoveredDoc.value)
        return true;
    else
        return false;
}

export const rxdb = true;
export const prototypes = {};
export const overwritable = {
    checkAdapter
};

export default {
    rxdb,
    prototypes,
    overwritable
};
