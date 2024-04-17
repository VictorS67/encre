import React, { FC, useEffect, useState } from 'react';

import { Snapshot, useGotoRecoilSnapshot, useRecoilSnapshot } from 'recoil';

export const DebugObserver: FC = () => {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
};

export const TimeTravelObserver: FC = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    if (snapshots.every((s) => s.getID() !== snapshot.getID())) {
      setSnapshots([...snapshots, snapshot]);
    }
  }, [snapshot]);

  const gotoSnapshot = useGotoRecoilSnapshot();

  return (
    <ol>
      {snapshots.map((snp, i) => (
        <li key={i}>
          Snapshot {i}
          <button onClick={() => gotoSnapshot(snp)}>Restore</button>
        </li>
      ))}
    </ol>
  );
};
