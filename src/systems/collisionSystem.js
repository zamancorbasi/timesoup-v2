export class CollisionSystem {
  static checkAABB(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static resolvePlayerPlatforms(player, platforms) {
    player.onGround = false;

    for (const p of platforms) {
      if (!this.checkAABB(player, p)) continue;

      // overlap miktarları
      const overlapLeft = player.x + player.width - p.x;
      const overlapRight = p.x + p.width - player.x;
      const overlapTop = player.y + player.height - p.y;
      const overlapBottom = p.y + p.height - player.y;

      const minOverlap = Math.min(
        overlapLeft,
        overlapRight,
        overlapTop,
        overlapBottom
      );

      // hangi taraftan çarptı?
      if (minOverlap === overlapTop) {
        player.y = p.y - player.height;
        player.vy = 0;
        player.onGround = true;

        player.jumpCount = 0; // ⭐ sadece burada reset
    }

      else if (minOverlap === overlapBottom) {
        // alttan çarptı
        player.y = p.y + p.height;
        player.vy = 0;
      }
      else if (minOverlap === overlapLeft) {
        // soldan
        player.x = p.x - player.width;
        player.vx = 0;
      }
      else if (minOverlap === overlapRight) {
        // sağdan
        player.x = p.x + p.width;
        player.vx = 0;
      }
    }
  }

  static checkPlayerCollectables(player, items) {
  for (const item of items) {
    if (item.collected) continue;

    if (this.checkAABB(player, {
      x: item.x,
      y: item.y,
      width: item.size,
      height: item.size
    })) {
      item.collected = true;
    }
  }
}


}
