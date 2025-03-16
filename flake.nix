{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs =
    { nixpkgs, prisma-utils, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit pkgs;
          # just copy these hashes for now, and then change them when nix complains about the mismatch
          prisma-fmt-hash = "sha256-iOJW0KK/yWIu5VpuLrq+EC5S7n5ygu1xfiHTttYfq+A="; 
          query-engine-hash = "sha256-kxhSxYFKXtIzqm0UxSu68d00n8jXj6t1Bq6X+1QAJ1E=";
          libquery-engine-hash = "sha256-P/lxd05Naf8ghTSJoIaJOMqlihhQelRwnbAPtwrAS8w=";
          schema-engine-hash = "sha256-RwmJu8Qm+ugpxWituK/k5DxdijJBesi82bop7ZWQ9p0";
        }).fromNpmLock
          ./package-lock.json; # <--- path to our package-lock.json file that contains the version of prisma-engines
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        env = prisma.env;
        # or, you can use `shellHook` instead of `env` to load the same environment variables.
        # shellHook = prisma.shellHook;
      };
    };
}