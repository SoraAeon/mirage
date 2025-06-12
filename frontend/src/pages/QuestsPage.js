import React, { useEffect, useState } from 'react';

const QuestsPage = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [nextChoices, setNextChoices] = useState([]);
  const [isFirst, setIsFirst] = useState(false);

  useEffect(() => {
    fetch('/api/quests/user-progress/')
      .then(res => res.json())
      .then(progresses => {
        if (progresses.length === 0) {
          setIsFirst(true);
          // ここで「最初のノードID」（例: 1）をセットしてもいい
        } else {
          const last = progresses[progresses.length - 1];
          setCurrentNode(last.node);
          return fetch(`/api/quests/choice-nodes/${last.node.id}/`)
            .then(res => res.json())
            .then(nodeData => setNextChoices(nodeData.next_choices || []));
        }
      });
  }, []);

const handleChoose = nextNodeId => {
fetch('/api/quests/user-progress/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ node: nextNodeId })
}).then(() => window.location.reload());
};

  // 「最初のノードがない」場合、最初のノードを選ばせるUI
  if (isFirst) return (
    <div>
      <h2>人生ツリー</h2>
      <div>はじめの選択肢を作りましょう！</div>
      {/* 例：choice-nodes一覧をAPIで取得して表示（1個だけなら自動で進行を追加） */}
    </div>
  );

  if (!currentNode) return <div>Loading...</div>;

  return (
    <div>
      <h2>人生ツリー</h2>
      <div>
        <strong>今の選択肢: </strong>{currentNode.name}
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>この先の分岐:</strong>
        <ul>
          {nextChoices.length === 0 ? (
            <li>これ以上の分岐はありません（完了）</li>
          ) : nextChoices.map(id => (
            <ChoiceButton key={id} nodeId={id} onChoose={handleChoose} />
          ))}
        </ul>
      </div>
    </div>
  );
};


// 各選択肢（ノード）の名前をAPIで取得
function ChoiceButton({ nodeId, onChoose }) {
  const [node, setNode] = useState(null);
  useEffect(() => {
    fetch(`/api/quests/choice-nodes/${nodeId}/`)
      .then(res => res.json())
      .then(setNode);
  }, [nodeId]);
  if (!node) return <li>Loading...</li>;
  return (
    <li>
      <button onClick={() => onChoose(nodeId)}>
        {node.name}
      </button> - {node.description}
    </li>
  );
}

export default QuestsPage;
