export function createRoundedButton(scene: Phaser.Scene, x: number, y: number, text: string, width: number = 120, height: number = 40, color: number = 0x4CAF50) {
    const graphics = scene.add.graphics();
    const cornerRadius = height / 2;
    
    // Draw rounded rectangle background
    drawRoundedButton(graphics, x, y, width, height, cornerRadius, color);

    const buttonText = scene.add.text(x + width / 2, y + height / 2, text, {
        fontSize: '24px',
        color: '#fff',
        fontFamily: 'Chewy'
    }).setOrigin(0.5);

    const hitArea = new Phaser.Geom.Rectangle(x, y, width, height);
    graphics.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Add hover handlers
    graphics.on('pointerover', () => {
        drawRoundedButton(graphics, x, y, width, height, cornerRadius, darkenColor(color));
    });

    graphics.on('pointerout', () => {
        drawRoundedButton(graphics, x, y, width, height, cornerRadius, color);
    });

    return { text: buttonText, bg: graphics };
}

function drawRoundedButton(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, cornerRadius: number, color: number) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.beginPath();
    graphics.moveTo(x, y + cornerRadius);
    graphics.lineTo(x, y + height - cornerRadius);
    graphics.arc(x + cornerRadius, y + height - cornerRadius, cornerRadius, Math.PI, Math.PI * 0.5, true);
    graphics.lineTo(x + width - cornerRadius, y + height);
    graphics.arc(x + width - cornerRadius, y + height - cornerRadius, cornerRadius, Math.PI * 0.5, 0, true);
    graphics.lineTo(x + width, y + cornerRadius);
    graphics.arc(x + width - cornerRadius, y + cornerRadius, cornerRadius, 0, Math.PI * 1.5, true);
    graphics.lineTo(x + cornerRadius, y);
    graphics.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI * 1.5, Math.PI, true);
    graphics.closePath();
    graphics.fill();
}

function darkenColor(color: number): number {
    const r = ((color >> 16) & 0xff) * 0.9;
    const g = ((color >> 8) & 0xff) * 0.9;
    const b = (color & 0xff) * 0.9;
    return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
}
