import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Play } from "lucide-react";

interface Team {
  name: string;
  score: number;
  color: string;
}

const TEAM_COLORS = [
  { name: "Purple", value: "purple", bg: "bg-[#9747FF]", border: "border-[#9747FF]" },
  { name: "Cyan", value: "cyan", bg: "bg-[#14D4E8]", border: "border-[#14D4E8]" },
  { name: "Orange", value: "orange", bg: "bg-[#FF8A3D]", border: "border-[#FF8A3D]" },
  { name: "Green", value: "green", bg: "bg-green-500", border: "border-green-500" },
  { name: "Pink", value: "pink", bg: "bg-pink-500", border: "border-pink-500" },
  { name: "Yellow", value: "yellow", bg: "bg-yellow-500", border: "border-yellow-500" },
];

interface TeamSetupProps {
  onStart: (teams: Team[], numberOfRounds: string) => void;
  onBack: () => void;
  initialTeams?: Team[];
}

export function TeamSetup({ onStart, onBack, initialTeams }: TeamSetupProps) {
  const [teams, setTeams] = useState<Team[]>(() => {
    if (initialTeams && initialTeams.length > 0) {
      return initialTeams.map(team => ({ ...team, score: 0 }));
    }
    return [
      { name: "", score: 0, color: "purple" },
      { name: "", score: 0, color: "cyan" },
    ];
  });
  const [numberOfRounds, setNumberOfRounds] = useState<string>("5");

  const addTeam = () => {
    if (teams.length < 6) {
      const usedColors = new Set(teams.map(t => t.color));
      const availableColor = TEAM_COLORS.find(c => !usedColors.has(c.value))?.value || "purple";
      setTeams([...teams, { name: "", score: 0, color: availableColor }]);
    }
  };

  const removeTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const updateTeamColor = (index: number, color: string) => {
    const newTeams = [...teams];
    newTeams[index].color = color;
    setTeams(newTeams);
  };

  const canStart = teams.every(t => t.name.trim().length > 0);

  const handleStart = () => {
    if (canStart) {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      onStart(teams, numberOfRounds);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 flex flex-col p-6">
      <button
        onClick={onBack}
        className="self-start text-white/90 hover:text-white transition-colors mb-6"
        data-testid="button-back-team-setup"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Team Setup
        </h1>
        <p className="text-white/90 text-center mb-8">
          Create {teams.length} teams to compete!
        </p>

        <div className="space-y-4 w-full mb-6">
          {teams.map((team, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20" data-testid={`team-card-${index}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <Input
                    placeholder={`Team ${index + 1} Name`}
                    value={team.name}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 text-lg h-12"
                    data-testid={`input-team-name-${index}`}
                    maxLength={20}
                  />
                </div>
                {teams.length > 2 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTeam(index)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    data-testid={`button-remove-team-${index}`}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {TEAM_COLORS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => updateTeamColor(index, colorOption.value)}
                    className={`w-10 h-10 rounded-lg ${colorOption.bg} ${
                      team.color === colorOption.value
                        ? `ring-4 ring-white scale-110`
                        : "opacity-60 hover:opacity-100"
                    } transition-all`}
                    data-testid={`button-color-${colorOption.value}-${index}`}
                    aria-label={`Select ${colorOption.name}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {teams.length < 6 && (
          <Button
            onClick={addTeam}
            variant="outline"
            className="w-full mb-6 bg-white/10 border-white/30 text-white hover:bg-white/20 h-12"
            data-testid="button-add-team"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team
          </Button>
        )}

        <div className="w-full mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3">Number of Rounds</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: "3", label: "3" },
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "infinite", label: "∞" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={numberOfRounds === option.value ? "default" : "outline"}
                className={`h-12 font-semibold ${
                  numberOfRounds === option.value
                    ? "bg-white text-purple-600 hover:bg-white/90"
                    : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                }`}
                onClick={() => setNumberOfRounds(option.value)}
                data-testid={`rounds-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full bg-white text-purple-600 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed h-14 text-lg font-semibold"
          data-testid="button-start-team-game"
        >
          <Play className="w-6 h-6 mr-2" />
          Start Team Game
        </Button>

        {!canStart && (
          <p className="text-white/70 text-sm mt-3 text-center">
            Please name all teams to continue
          </p>
        )}
      </div>
    </div>
  );
}
