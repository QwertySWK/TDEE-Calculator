// ==========================================
// 1. จัดการข้อมูลตอนเปิดเว็บ (On Load)
// ==========================================
document.addEventListener('DOMContentLoaded', function () {

    // 1.1 โหลดข้อมูลส่วนตัวจาก localStorage เพื่อเติมในฟอร์ม
    const savedData = localStorage.getItem('tdeeUserData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('gender').value = data.gender;
        document.getElementById('age').value = data.age;
        document.getElementById('weight').value = data.weight;
        document.getElementById('height').value = data.height;
        document.getElementById('activity').value = data.activity;
    }

    // 1.2 จัดการระบบ Dark Mode / Light Mode
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('appTheme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('appTheme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('appTheme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });
});

// ==========================================
// 2. จัดการเมื่อกดปุ่ม "คำนวณ" (Form Submit)
// ==========================================
document.getElementById('tdee-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // 2.1 ดึงค่าจากฟอร์ม
    const gender = document.getElementById('gender').value;
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // 2.2 บันทึกข้อมูลลงเครื่อง
    const userData = { gender, age, weight, height, activity };
    localStorage.setItem('tdeeUserData', JSON.stringify(userData));

    // 2.3 คำนวณ BMR
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 2.4 คำนวณ TDEE และเป้าหมาย
    const tdee = bmr * activity;
    const deficitMild = tdee - 500;
    const deficitExtreme = tdee - 750;

    // ตั้งค่าลิมิตต่ำสุด (ชาย 1500, หญิง 1200)
    const safeLimit = gender === 'male' ? 1500 : 1200;
    const finalMild = Math.max(Math.round(deficitMild), safeLimit);
    const finalExtreme = Math.max(Math.round(deficitExtreme), safeLimit);

    // 2.5 คำนวณ Macros
    const proteinGrams = weight * 2.2;
    const proteinCalories = proteinGrams * 4;

    const fatCalories = finalMild * 0.25;
    const fatGrams = fatCalories / 9;

    const carbsCalories = finalMild - proteinCalories - fatCalories;
    const carbsGrams = carbsCalories / 4;

    // ==========================================
    // 3. แสดงผลหน้าจอและซ่อนม่านเบลอ
    // ==========================================

    document.getElementById('bmr-result').textContent = Math.round(bmr).toLocaleString();
    document.getElementById('tdee-result').textContent = Math.round(tdee).toLocaleString();
    document.getElementById('deficit-mild').textContent = finalMild.toLocaleString();
    document.getElementById('deficit-extreme').textContent = finalExtreme.toLocaleString();

    document.getElementById('macro-protein').textContent = Math.round(proteinGrams);
    document.getElementById('macro-fat').textContent = Math.round(fatGrams);
    document.getElementById('macro-carbs').textContent = Math.max(0, Math.round(carbsGrams));

    // ซ่อนม่านเบลอ ให้เห็นกล่องผลลัพธ์
    document.getElementById('waiting-mask').classList.add('hidden');

    // เลื่อนหน้าจอลงมาให้เห็นผลลัพธ์ (สมูทสกรอล์)
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});