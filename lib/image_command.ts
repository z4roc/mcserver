export class ImageCommandBuilder {
  base_command: string;
  constructor() {
    this.base_command = "docker run --env-file=.env -d -it";
  }

  withName(name: string) {
    this.base_command += ` --name mcdocker-${name}`;
    return this;
  }

  withPort(port: number) {
    this.base_command += ` -p ${port}:25565`;
    return this;
  }

  withEula() {
    this.base_command += ` -e EULA=TRUE`;
    return this;
  }

  withWhiteList(names: string[]) {
    this.base_command += ` -e WHITELIST=${names.join(",")}`;
    return this;
  }

  withDifficulty(difficulty: number) {
    this.base_command += ` -e DIFFICULTY=${Difficulty[difficulty]}`;
    return this;
  }

  withDifficultyAsEnum(difficultyEnum: Difficulty) {
    this.base_command += ` -e DIFFICULTY=${Difficulty[difficultyEnum]}`;
    return this;
  }

  withMOTD(motd: string) {
    this.base_command += ` -e MOTD="${motd}"`;
    return this;
  }

  withMaxMemory(memory: number) {
    this.base_command += ` -e INIT_MEMORY=1G -e MAX_MEMORY=${memory}G`;
    return this;
  }

  withModpack(slug: string) {
    this.base_command += ` -e TYPE=AUTO_CURSEFORGE -e CF_SLUG=${slug}`;
    return this;
  }

  withOps(names: string[]) {
    this.base_command += ` -e OPS=${names.join(",")}`;
    return this;
  }

  withIcon(iconurl: string) {
    this.base_command += ` -e ICON=${iconurl}`;
    return this;
  }

  withPlayers(players: number) {
    this.base_command += ` -e MAX_PLAYERS=${players}`;
    return this;
  }

  withSeed(seed: number) {
    this.base_command += ` -e SEED=${seed}`;
  }

  withGameMode(mode: number) {
    this.base_command += ` -e GAMEMODE=${GameMode[mode]}`;
    return this;
  }

  withFlight() {
    this.base_command += ` -e ALLOW_FLIGHT=TRUE`;
    return this;
  }

  static defaultConfig(name: string, port: number, slug?: string) {
    if (slug) {
      return new ImageCommandBuilder()
        .withName(name)
        .withEula()
        .withMaxMemory(4)
        .withModpack(slug)
        .withDifficultyAsEnum(Difficulty.Normal);
    } else {
      return new ImageCommandBuilder()
        .withEula()
        .withName(name)
        .withMaxMemory(2)
        .withDifficulty(2);
    }
  }

  build() {
    return this.base_command + " itzg/minecraft-server";
  }
}

export enum Difficulty {
  Peaceful = 0,
  Easy = 1,
  Normal = 2,
  Hard = 3,
}

export enum GameMode {
  Survival = 0,
  Creative = 1,
  Adventure = 2,
  Spectator = 3,
}
