import { useState } from "react";
import { Character, Visitor, Extension } from "../lib/type";
import { BattleManager } from "../lib/BattleManager";

// ------------------- Initial Data -------------------
const defaultPlayer: Character = {
  name: "勇者",
  hp: 40,
  maxHp: 40,
  extensions: [],
  state: "idle",
};

const defaultEnemy: Character = {
  name: "スライム",
  hp: 30,
  maxHp: 30,
  extensions: [],
  state: "idle",
};

// ------------------- Visitor Implementation -------------------
const BattleVisitor: Visitor = {
  visitAttack: (attacker, defender) => {
    const damage = Math.floor(Math.random() * 8) + 3;
    defender.hp = Math.max(defender.hp - damage, 0);
    return `${attacker.name}の攻撃！ ${defender.name}に${damage}のダメージ！`;
  },
  visitDefend: (character) => {
    return `${character.name}は防御の体勢に入った。次のダメージを軽減！`;
  },
  visitHeal: (character) => {
    const heal = Math.floor(Math.random() * 5) + 5;
    character.hp = Math.min(character.hp + heal, character.maxHp);
    return `${character.name}は回復した！ HPが${heal}回復！`;
  },
};

// ------------------- React Component -------------------
export default function BattleDemo() {
  const [player, setPlayer] = useState<Character>({ ...defaultPlayer });
  const [enemy, setEnemy] = useState<Character>({ ...defaultEnemy });
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (entry: string) => setLog((l) => [entry, ...l]);

  const manager = new BattleManager(player, enemy, BattleVisitor);

  const handleAction = (action: Character["state"]) => {
    const playerMessage = manager.act(action);
    const enemyMessage = manager.enemyTurn();

    setPlayer({ ...manager.player });
    setEnemy({ ...manager.enemy });
    appendLog(enemyMessage);
    appendLog(playerMessage);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-center">🎮 バトルデモ</h1>
      <div className="grid grid-cols-2 gap-4">
        <CharacterCard character={player} />
        <CharacterCard character={enemy} />
      </div>

      <div className="flex justify-center space-x-2">
        <ActionButton label="攻撃" onClick={() => handleAction("attack")} />
        <ActionButton label="防御" onClick={() => handleAction("defend")} />
        <ActionButton label="回復" onClick={() => handleAction("heal")} />
      </div>

      <div className="bg-gray-100 p-3 rounded shadow">
        <h2 className="font-semibold mb-2">ログ:</h2>
        <div className="space-y-1 text-sm h-40 overflow-y-auto">
          {log.map((entry, idx) => (
            <div key={idx}>▶ {entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="p-4 rounded border shadow bg-white">
      <h3 className="font-bold text-lg">{character.name}</h3>
      <p>
        HP: {character.hp} / {character.maxHp}
      </p>
      <p>状態: {character.state}</p>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </button>
  );
}
