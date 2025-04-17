// BattleDemo.tsx
import { useState } from "react";
import { Visitor, Character, ICharacter } from "../lib/Character";
import {
  CharacterContext,
  CombatCharacterModule,
  ICombatRole,
} from "../lib/CharacterContext";
import { BattleManager } from "../lib/BattleManager";
import { healingSkill } from "../lib/skill";

const player = new Character("勇者", 40, 40);
const playerContext = new CharacterContext();
playerContext.addRole("combat", new CombatCharacterModule([], [healingSkill]));
player.setContext(playerContext);

const enemy = new Character("スライム", 30, 30);
const enemyContext = new CharacterContext();
enemyContext.addRole("combat", new CombatCharacterModule());
enemy.setContext(enemyContext);

export class BattleVisitor implements Visitor {
  visitAttack(attacker: ICharacter, defender: ICharacter) {
    const damage = Math.floor(Math.random() * 8) + 3;
    defender.hp = Math.max(defender.hp - damage, 0);
    return `${attacker.name}の攻撃！ ${defender.name}に${damage}のダメージ！`;
  }
  visitDefend(character: ICharacter) {
    return `${character.name}は防御の体勢に入った。次のダメージを軽減！`;
  }
}

export default function BattleDemo() {
  const [playerState, setPlayer] = useState<Character>(player);
  const [enemyState, setEnemy] = useState<Character>(enemy);
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (entry: string) => setLog((l) => [entry, ...l]);
  const manager = new BattleManager(
    playerState,
    enemyState,
    new BattleVisitor()
  );

  const handleAction = (action: ICombatRole["state"], skillName?: string) => {
    const playerMessage = manager.act(
      manager.player,
      manager.enemy,
      action,
      skillName
    );
    const enemyMessage = manager.enemyTurn();

    setPlayer(manager.player);
    setEnemy(manager.enemy);
    appendLog(enemyMessage);
    appendLog(playerMessage);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gradient-to-b from-green-50 to-blue-100 rounded-xl shadow-lg space-y-6">
      <header className="flex flex-col items-center space-y-1">
        <h1 className="text-2xl font-extrabold text-blue-800">⚔️ 模擬戦闘</h1>
        <p className="text-sm text-gray-600">勇者 vs スライム</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <CharacterCard character={playerState} isPlayer />
        <CharacterCard character={enemyState} />
      </div>

      <div className="flex justify-center gap-4">
        <ActionButton
          label="攻撃"
          color="red"
          onClick={() => handleAction("attack")}
        />
        <ActionButton
          label="防御"
          color="yellow"
          onClick={() => handleAction("defend")}
        />
        <ActionButton
          label="回復"
          color="green"
          onClick={() => handleAction("useSkill", "ヒール")}
        />
      </div>

      <div className="bg-white border border-blue-200 p-4 rounded-md shadow-inner h-48 overflow-y-auto">
        <h2 className="font-semibold mb-2 text-blue-700">🎙️ バトルログ</h2>
        <div className="space-y-1 text-sm text-gray-700">
          {log.map((entry, idx) => (
            <div key={idx} className="before:content-['▶'] before:mr-1">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterCard({
  character,
  isPlayer = false,
}: {
  character: Character;
  isPlayer?: boolean;
}) {
  const context = character.getContext();
  const combat = context?.getRole<ICombatRole>("combat");

  return (
    <div
      className={`p-4 rounded-xl border shadow-lg ${
        isPlayer ? "bg-yellow-50" : "bg-white"
      }`}
    >
      <h3 className="font-bold text-lg text-center text-gray-800">
        {character.name}
      </h3>
      <div className="text-sm text-gray-600 mt-2">
        <p>
          HP: <span className="font-semibold text-red-600">{character.hp}</span>{" "}
          / {character.maxHp}
        </p>
        <p>アクション: {combat?.state}</p>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  color,
}: {
  label: string;
  onClick: () => void;
  color: "red" | "yellow" | "green";
}) {
  const base =
    "px-6 py-2 font-semibold rounded-full text-white text-sm shadow-md hover:scale-105 transition-transform";
  const colorMap = {
    red: "bg-red-500 hover:bg-red-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  return (
    <button onClick={onClick} className={`${base} ${colorMap[color]}`}>
      {label}
    </button>
  );
}
