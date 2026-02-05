export class CollisionSystem {

  // =========================================
  // ⭐ HITBOX OKUYUCU (ortak fonksiyon)
  // =========================================
  static getBox(e) {
    return {
      x: e.x + (e.hitboxOffsetX || 0),
      y: e.y + (e.hitboxOffsetY || 0),
      width: e.hitboxWidth || e.width,
      height: e.hitboxHeight || e.height
    };
  }


  // =========================================
  // AABB
  // =========================================
  static checkAABB(a, b) {
    const A = this.getBox(a);
    const B = this.getBox(b);

    return (
      A.x < B.x + B.width &&
      A.x + A.width > B.x &&
      A.y < B.y + B.height &&
      A.y + A.height > B.y
    );
  }


  // =========================================
  // PLATFORM COLLISION
  // =========================================
  static resolvePlayerPlatforms(player, platforms) {
    player.onGround = false;

    const pb = this.getBox(player);

    for (const p of platforms) {
      const plat = this.getBox(p);

      if (!this.checkAABB(player, p)) continue;

      const overlapLeft = pb.x + pb.width - plat.x;
      const overlapRight = plat.x + plat.width - pb.x;
      const overlapTop = pb.y + pb.height - plat.y;
      const overlapBottom = plat.y + plat.height - pb.y;

      const minOverlap = Math.min(
        overlapLeft,
        overlapRight,
        overlapTop,
        overlapBottom
      );

      // ⭐ ÜSTTEN (ground)
      if (minOverlap === overlapTop) {
        player.y -= overlapTop;
        player.vy = 0;
        player.onGround = true;
        player.jumpCount = 0;
      }

      // ⭐ ALTTAN
      else if (minOverlap === overlapBottom) {
        player.y += overlapBottom;
        player.vy = 0;
      }

      // ⭐ SOLDAN
      else if (minOverlap === overlapLeft) {
        player.x -= overlapLeft;
        player.vx = 0;
      }

      // ⭐ SAĞDAN
      else if (minOverlap === overlapRight) {
        player.x += overlapRight;
        player.vx = 0;
      }
    }
  }


  // =========================================
  // COLLECTABLE
  // =========================================
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


  // =========================================
  // ENEMY
  // =========================================
  static checkPlayerEnemies(player, enemies) {

    const pb = this.getBox(player);

    for (const e of enemies) {

      // ⭐ squash olmuşsa artık collision alma
      if (!e.alive || e.squashed) continue;

      const eb = this.getBox(e);

      if (!this.checkAABB(player, e)) continue;

      const prevBottom = player.prevY + pb.height;
      const currentBottom = pb.y + pb.height;

      const wasAbove = prevBottom <= eb.y;
      const falling = player.vy > 0;

      // ======================
      // ⭐ STOMP
      // ======================
      if (wasAbove && falling) {

        e.squashed = true;
        e.alive = false;   // ⭐⭐⭐ EN KRİTİK SATIR
        e.squashTimer = 0.2;

        player.vy = -900;

        return false;
      }

      // ======================
      // NORMAL ÖLÜM
      // ======================
      return true;
    }

    return false;
  }




  // =========================================
  // FLAG
  // =========================================
  static checkPlayerFlag(player, flag) {
    return this.checkAABB(player, flag);
  }

}
