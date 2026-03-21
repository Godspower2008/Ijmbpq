<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>For Ummul Khairat</title>
    <style>
        :root {
            --emerald: #064e3b;
            --gold: #d4af37;
            --ivory: #fdfaf1;
            --glass: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        body {
            background: radial-gradient(circle at center, var(--emerald) 0%, #021a1b 100%);
            height: 100dvh; /* Dynamic viewport height for mobile browsers */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            font-family: 'Georgia', serif;
            color: var(--ivory);
            perspective: 1000px;
        }

        /* Responsive Background Canvas */
        #stars { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }

        /* Password Overlay */
        #gatekeeper {
            position: fixed;
            inset: 0;
            background: #021a1b;
            z-index: 200;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s ease;
        }

        #gatekeeper input {
            background: var(--glass);
            border: 1px solid var(--gold);
            padding: 12px;
            border-radius: 10px;
            color: white;
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 15px;
            outline: none;
            width: 200px;
        }

        /* Countdown Style - Responsive font */
        #countdown {
            position: fixed;
            top: clamp(10px, 3vh, 20px);
            background: var(--glass);
            backdrop-filter: blur(10px);
            padding: 8px 16px;
            border-radius: 50px;
            border: 1px solid var(--gold);
            font-size: clamp(0.7rem, 2.5vw, 0.9rem);
            z-index: 100;
        }

        /* Responsive Gift Container */
        .container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.8s ease;
        }

        .gift-box {
            width: clamp(100px, 30vw, 140px);
            height: clamp(100px, 30vw, 140px);
            background: linear-gradient(135deg, var(--gold), #b38f4d);
            border-radius: 10px;
            position: relative;
            box-shadow: 0 15px 35px rgba(0,0,0,0.6);
            z-index: 20;
        }

        .lid {
            position: absolute;
            bottom: -5px;
            width: 110%;
            left: -5%;
            height: 25px;
            background: #e5c05b;
            border: 1px solid var(--gold);
            border-radius: 4px;
            transition: transform 1s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 0.5s;
        }

        /* The Card - Responsive sizing */
        .card {
            position: absolute;
            width: 85vw;
            max-width: 320px;
            background: var(--ivory);
            border-radius: 20px;
            padding: clamp(20px, 5vw, 35px);
            color: #333;
            text-align: center;
            opacity: 0;
            z-index: 5;
            transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            pointer-events: none;
        }

        /* Gravity Trigger */
        .opened .lid { transform: translateY(600px) rotate(20deg); opacity: 0; }
        .opened .card {
            opacity: 1;
            transform: translateY(clamp(150px, 40vh, 250px)) scale(1);
            pointer-events: auto;
        }

        h2 { color: var(--gold); margin-bottom: 10px; font-size: 1.2rem; }
        #message { font-style: italic; font-size: clamp(0.85rem, 3.5vw, 1rem); line-height: 1.6; color: var(--emerald); min-height: 80px; }

        .instruction {
            position: fixed;
            bottom: 30px;
            font-size: 0.65rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: center;
            width: 90%;
            opacity: 0.6;
        }

        /* Responsive Utility */
        @media (max-width: 500px) {
            .gift-box { width: 110px; height: 110px; }
            .card { width: 90vw; }
        }
    </style>
</head>
<body>

    <canvas id="stars"></canvas>

    <div id="gatekeeper">
        <h2 style="margin-bottom: 20px;">Private Garden</h2>
        <input type="password" id="pass" placeholder="Enter Password">
        <p style="font-size: 0.7rem; opacity: 0.5;">Hint: A special date or word</p>
    </div>

    <div id="countdown">🌙 EID AL-ADHA IN: ...</div>

    <div class="container" id="main-ui">
        <div class="card" id="the-card">
            <h2>For Ummul Khairat</h2>
            <p id="message">Flipping through your blessings...</p>
            <p style="font-size: 0.6rem; margin-top: 20px; color: #999;">Shake for another Dua</p>
        </div>
        
        <div class="gift-box">
            <div class="lid"></div>
            <div style="position:absolute; width:15%; height:100%; left:42.5%; background:rgba(255,255,255,0.2);"></div>
            <div style="position:absolute; width:100%; height:15%; top:42.5%; background:rgba(255,255,255,0.2);"></div>
        </div>
        <p id="label" style="margin-top:20px; font-size: 0.9rem; color:var(--gold);">Gently flip your phone</p>
    </div>

    <div class="instruction" id="hint">Unlock to see your gift</div>

    <script>
        let opened = false;
        let msgIdx = 0;
        const messages = [
            "May Allah bless you always, Ummul Khairat, filling your life with peace, barakah, and happiness.",
            "Ummul Khairat, your kindness is a true gift. I thank Allah every day for your presence.",
            "May your heart find tranquility (Sakina) and your path be lit by His divine grace.",
            "I ask Allah to protect your beautiful smile and grant you the highest stations of Jannah.",
            "You are a blessing I never want to take for granted. May your light never dim."
        ];

        // 1. Password Verification
        document.getElementById('pass').addEventListener('input', (e) => {
            if(e.target.value === '1234') { // CHANGE PASSWORD HERE
                document.getElementById('gatekeeper').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('gatekeeper').style.display = 'none';
                    initSensors();
                }, 800);
            }
        });

        // 2. Stars Background
        const canvas = document.getElementById('stars');
        const ctx = canvas.getContext('2d');
        let stars = [];
        function initStars() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            for(let i=0; i<60; i++) stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2, sp: Math.random()*0.4+0.1});
        }
        function drawStars() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            ctx.fillStyle = "white";
            stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI*2); ctx.fill(); s.y += s.sp; if(s.y > canvas.height) s.y = 0; });
            requestAnimationFrame(drawStars);
        }
        initStars(); drawStars();

        // 3. Sensor Activation
        function initSensors() {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().catch(console.error);
                DeviceMotionEvent.requestPermission().catch(console.error);
            }
            window.addEventListener('deviceorientation', (e) => {
                if(!opened && (e.beta > 150 || e.beta < -150)) triggerOpen();
            });
            window.addEventListener('devicemotion', handleShake);
            document.getElementById('hint').innerText = "Rotate phone upside down";
        }

        function triggerOpen() {
            opened = true;
            document.getElementById('main-ui').classList.add('opened');
            document.getElementById('label').style.opacity = '0';
            document.getElementById('hint').innerText = "Shake for more blessings";
            nextMsg();
        }

        let lastShake = 0;
        function handleShake(e) {
            const acc = e.accelerationIncludingGravity;
            const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
            if (opened && total > 22 && (Date.now() - lastShake > 1000)) {
                lastShake = Date.now();
                nextMsg();
            }
        }

        function nextMsg() {
            const m = document.getElementById('message');
            m.style.opacity = 0;
            setTimeout(() => {
                m.innerText = messages[msgIdx];
                m.style.opacity = 1;
                msgIdx = (msgIdx + 1) % messages.length;
            }, 300);
        }

        // 4. Countdown Timer
        function updateTimer() {
            const target = new Date("June 26, 2026 00:00:00").getTime();
            const now = new Date().getTime();
            const diff = target - now;
            const d = Math.floor(diff/86400000);
            const h = Math.floor((diff%86400000)/3600000);
            document.getElementById("countdown").innerText = `🌙 EID IN: ${d}D ${h}H`;
        }
        setInterval(updateTimer, 1000); updateTimer();
    </script>
</body>
</html>