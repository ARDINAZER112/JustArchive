import pygame
import sys
import math

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 576
FPS = 60
GRAVITY = 0.8
JUMP_STRENGTH = -16
PLAYER_SPEED = 6
PLAYER_DASH_SPEED = 12
ENEMY_SPEED = 1
ATTACK_DAMAGE = 1
PLAYER_MAX_HEALTH = 4
ENEMY_MAX_HEALTH = 2

# Colors (Hollow Knight inspired dark palette)
BLACK = (20, 12, 28)
DARK_PURPLE = (48, 28, 68)
WHITE = (224, 192, 160)
LIGHT_BLUE = (120, 180, 240)
RED = (200, 60, 60)
GREEN = (60, 200, 120)

# Simple tile-based level (1 = platform, 0 = empty)
LEVEL = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

TILE_SIZE = 64

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((32, 48))
        self.image.fill(LIGHT_BLUE)
        pygame.draw.rect(self.image, WHITE, (4, 8, 24, 32))  # Simple knight body
        pygame.draw.circle(self.image, WHITE, (16, 12), 8)    # Head
        pygame.draw.polygon(self.image, BLACK, [(16,12),(20,16),(24,20)])  # Horn
        self.rect = self.image.get_rect()
        self.rect.x = 100
        self.rect.y = 100
        self.vel_x = 0
        self.vel_y = 0
        self.on_ground = False
        self.facing_right = True
        self.health = PLAYER_MAX_HEALTH
        self.max_health = PLAYER_MAX_HEALTH
        self.dash_timer = 0
        self.attack_timer = 0
        self.attack_rect = None

    def update(self, platforms, enemies):
        # Horizontal movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.vel_x = -PLAYER_SPEED
            self.facing_right = False
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.vel_x = PLAYER_SPEED
            self.facing_right = True
        else:
            self.vel_x *= 0.8  # Friction

        # Dash (Shift)
        if keys[pygame.K_LSHIFT] and self.dash_timer == 0:
            self.dash_timer = 10
            dash_dir = PLAYER_DASH_SPEED if self.facing_right else -PLAYER_DASH_SPEED
            self.vel_x = dash_dir

        if self.dash_timer > 0:
            self.dash_timer -= 1
        else:
            self.vel_x = max(-PLAYER_SPEED, min(PLAYER_SPEED, self.vel_x))

        # Gravity
        if not self.on_ground:
            self.vel_y += GRAVITY

        # Jumping (Space)
        if (keys[pygame.K_SPACE] or keys[pygame.K_UP] or keys[pygame.K_w]) and self.on_ground:
            self.vel_y = JUMP_STRENGTH
            self.on_ground = False

        # Attack (CTRL)
        if keys[pygame.K_LCTRL]:
            if self.attack_timer == 0:
                self.attack_timer = 15
                attack_width = 50
                attack_x = self.rect.right if self.facing_right else self.rect.left - attack_width
                self.attack_rect = pygame.Rect(attack_x, self.rect.y + 8, attack_width, 32)
                # Damage enemies
                for enemy in enemies:
                    if self.attack_rect.colliderect(enemy.rect):
                        enemy.health -= ATTACK_DAMAGE
                        if enemy.health <= 0:
                            enemy.kill()

        if self.attack_timer > 0:
            self.attack_timer -= 1
        else:
            self.attack_rect = None

        # Horizontal collision and movement
        self.rect.x += self.vel_x
        self.on_ground = False
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_x > 0:
                    self.rect.right = platform.rect.left
                elif self.vel_x < 0:
                    self.rect.left = platform.rect.right
                self.vel_x = 0

        # Vertical collision and movement
        self.rect.y += self.vel_y
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_y > 0:
                    self.rect.bottom = platform.rect.top
                    self.on_ground = True
                    self.vel_y = 0
                elif self.vel_y < 0:
                    self.rect.top = platform.rect.bottom
                    self.vel_y = 0

        # Keep in bounds
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > SCREEN_WIDTH:
            self.rect.right = SCREEN_WIDTH
        if self.rect.top > SCREEN_HEIGHT:
            self.health = 0  # Death

    def draw(self, screen, camera_x):
        # Flip image if facing left
        draw_image = self.image if self.facing_right else pygame.transform.flip(self.image, True, False)
        screen.blit(draw_image, (self.rect.x - camera_x, self.rect.y))
        # Draw attack
        if self.attack_rect:
            pygame.draw.rect(screen, RED, (self.attack_rect.x - camera_x, self.attack_rect.y, self.attack_rect.width, self.attack_rect.height))
        # Health bar
        bar_width = 100
        bar_height = 8
        fill = (self.health / self.max_health) * bar_width
        pygame.draw.rect(screen, RED, (self.rect.x - camera_x - 10, self.rect.y - 20, bar_width, bar_height))
        pygame.draw.rect(screen, GREEN, (self.rect.x - camera_x - 10, self.rect.y - 20, fill, bar_height))

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((28, 36))
        self.image.fill((100, 60, 120))  # Bug-like enemy
        pygame.draw.circle(self.image, RED, (14, 18), 12)  # Body
        pygame.draw.circle(self.image, BLACK, (14, 18), 8) # Eyes
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.vel_x = -ENEMY_SPEED
        self.health = ENEMY_MAX_HEALTH
        self.patrol_range = 200
        self.start_x = x

    def update(self, platforms, player):
        # Simple patrol AI, chase if close
        if abs(player.rect.x - self.rect.x) < 150:
            if player.rect.x > self.rect.x:
                self.vel_x = ENEMY_SPEED
            else:
                self.vel_x = -ENEMY_SPEED
        else:
            # Patrol
            if self.rect.x < self.start_x - self.patrol_range / 2:
                self.vel_x = ENEMY_SPEED
            elif self.rect.x > self.start_x + self.patrol_range / 2:
                self.vel_x = -ENEMY_SPEED

        self.rect.x += self.vel_x

        # Platform collision (basic)
        self.rect.y += GRAVITY * 2  # Fall slower
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_x > 0:
                    self.rect.right = platform.rect.left
                elif self.vel_x < 0:
                    self.rect.left = platform.rect.right

        # Damage player on touch
        if self.rect.colliderect(player.rect):
            player.health -= 1  # Simple damage

    def draw(self, screen, camera_x):
        screen.blit(self.image, (self.rect.x - camera_x, self.rect.y))
        # Health indicator (small)
        if self.health < ENEMY_MAX_HEALTH:
            pygame.draw.rect(screen, RED, (self.rect.x - camera_x, self.rect.y - 10, 20, 4))
            fill = (self.health / ENEMY_MAX_HEALTH) * 20
            pygame.draw.rect(screen, GREEN, (self.rect.x - camera_x, self.rect.y - 10, fill, 4))

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((TILE_SIZE, TILE_SIZE))
        self.image.fill(DARK_PURPLE)
        pygame.draw.rect(self.image, WHITE, (8, 8, TILE_SIZE-16, TILE_SIZE-16))
        self.rect = self.image.get_rect()
        self.rect.x = x * TILE_SIZE
        self.rect.y = y * TILE_SIZE

def generate_platforms(level):
    platforms = pygame.sprite.Group()
    for y, row in enumerate(level):
        for x, tile in enumerate(row):
            if tile == 1:
                platform = Platform(x, y)
                platforms.add(platform)
    return platforms

def main():
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Hollow Knight Inspired Platformer")
    clock = pygame.time.Clock()

    all_sprites = pygame.sprite.Group()
    enemies = pygame.sprite.Group()

    player = Player()
    all_sprites.add(player)

    platforms = generate_platforms(LEVEL)
    all_sprites.add(platforms.sprites())  # Add platforms to all_sprites for potential drawing

    # Spawn enemies
    enemy1 = Enemy(600, 200)
    enemy2 = Enemy(900, 300)
    enemies.add(enemy1, enemy2)
    all_sprites.add(enemy1, enemy2)

    camera_x = 0
    running = True
    font = pygame.font.Font(None, 36)

    while running:
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Update
        player.update(platforms, enemies)
        for enemy in enemies:
            enemy.update(platforms, player)

        # Camera follow player
        camera_x = player.rect.centerx - SCREEN_WIDTH // 2

        # Draw
        screen.fill(BLACK)

        # Draw platforms (shifted by camera)
        for platform in platforms:
            screen.blit(platform.image, (platform.rect.x - camera_x, platform.rect.y))

        # Draw enemies
        for enemy in enemies:
            enemy.draw(screen, camera_x)

        # Draw player
        player.draw(screen, camera_x)

        # UI
        health_text = font.render(f"Health: {player.health}/{player.max_health}", True, WHITE)
        screen.blit(health_text, (10, 10))

        if player.health <= 0:
            game_over_text = font.render("GAME OVER - Press R to Restart", True, RED)
            screen.blit(game_over_text, (SCREEN_WIDTH//2 - 200, SCREEN_HEIGHT//2))
            keys = pygame.key.get_pressed()
            if keys[pygame.K_r]:
                main()  # Restart
                return

        enemies_count = len(enemies)
        if enemies_count == 0:
            win_text = font.render("YOU WIN! All enemies defeated!", True, GREEN)
            screen.blit(win_text, (SCREEN_WIDTH//2 - 150, SCREEN_HEIGHT//2))

        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()import pygame
import sys
import math

# Initialize Pygame
pygame.init()
screen = pygame.display.set_mode((1024, 576))
pygame.display.set_caption("Hollow Knight Inspired Platformer")

# Constants
SCREEN_WIDTH = 1024
SCREEN_HEIGHT = 576
FPS = 60
GRAVITY = 0.8
JUMP_STRENGTH = -16
PLAYER_SPEED = 6
PLAYER_DASH_SPEED = 12
ENEMY_SPEED = 1
ATTACK_DAMAGE = 1
PLAYER_MAX_HEALTH = 4
ENEMY_MAX_HEALTH = 2

# Colors (Hollow Knight inspired dark palette)
BLACK = (20, 12, 28)
DARK_PURPLE = (48, 28, 68)
WHITE = (224, 192, 160)
LIGHT_BLUE = (120, 180, 240)
RED = (200, 60, 60)
GREEN = (60, 200, 120)

# Simple tile-based level (1 = platform, 0 = empty)
LEVEL = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

TILE_SIZE = 64

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((32, 48))
        self.image.fill(LIGHT_BLUE)
        pygame.draw.rect(self.image, WHITE, (4, 8, 24, 32))  # Simple knight body
        pygame.draw.circle(self.image, WHITE, (16, 12), 8)    # Head
        pygame.draw.polygon(self.image, BLACK, [(16,12),(20,16),(24,20)])  # Horn
        self.rect = self.image.get_rect()
        self.rect.x = 100
        self.rect.y = 100
        self.vel_x = 0
        self.vel_y = 0
        self.on_ground = False
        self.facing_right = True
        self.health = PLAYER_MAX_HEALTH
        self.max_health = PLAYER_MAX_HEALTH
        self.dash_timer = 0
        self.attack_timer = 0
        self.attack_rect = None

    def update(self, platforms, enemies):
        # Horizontal movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.vel_x = -PLAYER_SPEED
            self.facing_right = False
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.vel_x = PLAYER_SPEED
            self.facing_right = True
        else:
            self.vel_x *= 0.8  # Friction

        # Dash (Shift)
        if keys[pygame.K_LSHIFT] and self.dash_timer == 0:
            self.dash_timer = 10
            dash_dir = PLAYER_DASH_SPEED if self.facing_right else -PLAYER_DASH_SPEED
            self.vel_x = dash_dir

        if self.dash_timer > 0:
            self.dash_timer -= 1
        else:
            self.vel_x = max(-PLAYER_SPEED, min(PLAYER_SPEED, self.vel_x))

        # Gravity
        if not self.on_ground:
            self.vel_y += GRAVITY

        # Jumping (Space)
        if (keys[pygame.K_SPACE] or keys[pygame.K_UP] or keys[pygame.K_w]) and self.on_ground:
            self.vel_y = JUMP_STRENGTH
            self.on_ground = False

        # Attack (CTRL)
        if keys[pygame.K_LCTRL]:
            if self.attack_timer == 0:
                self.attack_timer = 15
                attack_width = 50
                attack_x = self.rect.right if self.facing_right else self.rect.left - attack_width
                self.attack_rect = pygame.Rect(attack_x, self.rect.y + 8, attack_width, 32)
                # Damage enemies
                for enemy in enemies:
                    if self.attack_rect.colliderect(enemy.rect):
                        enemy.health -= ATTACK_DAMAGE
                        if enemy.health <= 0:
                            enemy.kill()

        if self.attack_timer > 0:
            self.attack_timer -= 1
        else:
            self.attack_rect = None

        # Horizontal collision and movement
        self.rect.x += self.vel_x
        self.on_ground = False
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_x > 0:
                    self.rect.right = platform.rect.left
                elif self.vel_x < 0:
                    self.rect.left = platform.rect.right
                self.vel_x = 0

        # Vertical collision and movement
        self.rect.y += self.vel_y
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_y > 0:
                    self.rect.bottom = platform.rect.top
                    self.on_ground = True
                    self.vel_y = 0
                elif self.vel_y < 0:
                    self.rect.top = platform.rect.bottom
                    self.vel_y = 0

        # Keep in bounds
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > SCREEN_WIDTH:
            self.rect.right = SCREEN_WIDTH
        if self.rect.top > SCREEN_HEIGHT:
            self.health = 0  # Death

    def draw(self, screen, camera_x):
        # Flip image if facing left
        draw_image = self.image if self.facing_right else pygame.transform.flip(self.image, True, False)
        screen.blit(draw_image, (self.rect.x - camera_x, self.rect.y))
        # Draw attack
        if self.attack_rect:
            pygame.draw.rect(screen, RED, (self.attack_rect.x - camera_x, self.attack_rect.y, self.attack_rect.width, self.attack_rect.height))
        # Health bar
        bar_width = 100
        bar_height = 8
        fill = (self.health / self.max_health) * bar_width
        pygame.draw.rect(screen, RED, (self.rect.x - camera_x - 10, self.rect.y - 20, bar_width, bar_height))
        pygame.draw.rect(screen, GREEN, (self.rect.x - camera_x - 10, self.rect.y - 20, fill, bar_height))

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((28, 36))
        self.image.fill((100, 60, 120))  # Bug-like enemy
        pygame.draw.circle(self.image, RED, (14, 18), 12)  # Body
        pygame.draw.circle(self.image, BLACK, (14, 18), 8) # Eyes
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        self.vel_x = -ENEMY_SPEED
        self.health = ENEMY_MAX_HEALTH
        self.patrol_range = 200
        self.start_x = x

    def update(self, platforms, player):
        # Simple patrol AI, chase if close
        if abs(player.rect.x - self.rect.x) < 150:
            if player.rect.x > self.rect.x:
                self.vel_x = ENEMY_SPEED
            else:
                self.vel_x = -ENEMY_SPEED
        else:
            # Patrol
            if self.rect.x < self.start_x - self.patrol_range / 2:
                self.vel_x = ENEMY_SPEED
            elif self.rect.x > self.start_x + self.patrol_range / 2:
                self.vel_x = -ENEMY_SPEED

        self.rect.x += self.vel_x

        # Platform collision (basic)
        self.rect.y += GRAVITY * 2  # Fall slower
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.vel_x > 0:
                    self.rect.right = platform.rect.left
                elif self.vel_x < 0:
                    self.rect.left = platform.rect.right

        # Damage player on touch
        if self.rect.colliderect(player.rect):
            player.health -= 1  # Simple damage

    def draw(self, screen, camera_x):
        screen.blit(self.image, (self.rect.x - camera_x, self.rect.y))
        # Health indicator (small)
        if self.health < ENEMY_MAX_HEALTH:
            pygame.draw.rect(screen, RED, (self.rect.x - camera_x, self.rect.y - 10, 20, 4))
            fill = (self.health / ENEMY_MAX_HEALTH) * 20
            pygame.draw.rect(screen, GREEN, (self.rect.x - camera_x, self.rect.y - 10, fill, 4))

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((TILE_SIZE, TILE_SIZE))
        self.image.fill(DARK_PURPLE)
        pygame.draw.rect(self.image, WHITE, (8, 8, TILE_SIZE-16, TILE_SIZE-16))
        self.rect = self.image.get_rect()
        self.rect.x = x * TILE_SIZE
        self.rect.y = y * TILE_SIZE

def generate_platforms(level):
    platforms = pygame.sprite.Group()
    for y, row in enumerate(level):
        for x, tile in enumerate(row):
            if tile == 1:
                platform = Platform(x, y)
                platforms.add(platform)
    return platforms

def main():
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Hollow Knight Inspired Platformer")
    clock = pygame.time.Clock()

    all_sprites = pygame.sprite.Group()
    enemies = pygame.sprite.Group()

    player = Player()
    all_sprites.add(player)

    platforms = generate_platforms(LEVEL)
    all_sprites.add(platforms.sprites())  # Add platforms to all_sprites for potential drawing

    # Spawn enemies
    enemy1 = Enemy(600, 200)
    enemy2 = Enemy(900, 300)
    enemies.add(enemy1, enemy2)
    all_sprites.add(enemy1, enemy2)

    camera_x = 0
    running = True
    font = pygame.font.Font(None, 36)

    while running:
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Update
        player.update(platforms, enemies)
        for enemy in enemies:
            enemy.update(platforms, player)

        # Camera follow player
        camera_x = player.rect.centerx - SCREEN_WIDTH // 2

        # Draw
        screen.fill(BLACK)

        # Draw platforms (shifted by camera)
        for platform in platforms:
            screen.blit(platform.image, (platform.rect.x - camera_x, platform.rect.y))

        # Draw enemies
        for enemy in enemies:
            enemy.draw(screen, camera_x)

        # Draw player
        player.draw(screen, camera_x)

        # UI
        health_text = font.render(f"Health: {player.health}/{player.max_health}", True, WHITE)
        screen.blit(health_text, (10, 10))

        if player.health <= 0:
            game_over_text = font.render("GAME OVER - Press R to Restart", True, RED)
            screen.blit(game_over_text, (SCREEN_WIDTH//2 - 200, SCREEN_HEIGHT//2))
            keys = pygame.key.get_pressed()
            if keys[pygame.K_r]:
                main()  # Restart
                return

        enemies_count = len(enemies)
        if enemies_count == 0:
            win_text = font.render("YOU WIN! All enemies defeated!", True, GREEN)
            screen.blit(win_text, (SCREEN_WIDTH//2 - 150, SCREEN_HEIGHT//2))

        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()