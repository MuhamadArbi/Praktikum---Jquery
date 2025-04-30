document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeMenu = document.getElementById('close-menu');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;
    const navLinks = mainNav.querySelectorAll('a'); 

    function toggleSidebar() {
        mainNav.classList.toggle('active'); 
        body.classList.toggle('sidebar-open'); 

        const isActive = mainNav.classList.contains('active');
        hamburgerMenu.setAttribute('aria-expanded', isActive);
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleSidebar);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', toggleSidebar); 
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            
            if (mainNav.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    document.addEventListener('click', (event) => {
        
        if (mainNav.classList.contains('active') &&
            !mainNav.contains(event.target) &&
            !hamburgerMenu.contains(event.target)) {
            toggleSidebar();
        }
    });

     
     let previousScrollY = 0;
     const sidebarOpenObserver = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
             if (mutation.attributeName === 'class') {
                 const targetElement = mutation.target;
                 if (targetElement.classList.contains('sidebar-open')) {
                     
                     previousScrollY = window.scrollY;
                     body.style.position = 'fixed';
                     body.style.top = `-${previousScrollY}px`;
                     body.style.width = '100%'; 
                 } else {
                     
                     body.style.position = '';
                     body.style.top = '';
                     body.style.width = '';
                     window.scrollTo(0, previousScrollY);
                 }
             }
         });
     });

     sidebarOpenObserver.observe(body, { attributes: true });
     // ========== CONTACT FORM VALIDATION ==========

const $contactForm = $('#contactForm');
const $nama = $('#nama');
const $email = $('#email');
const $telepon = $('#telepon');
const $pesan = $('#pesan');
const $formStatus = $('#form-status'); // Element untuk status umum form

// Helper: Fungsi untuk menampilkan pesan error di samping field
function showError($field, $errorContainer, message) {
    $errorContainer.text(message).show(); // Tampilkan teks error
    $field.addClass('input-error');      // Tambahkan class untuk styling border merah, dll.
}

// Helper: Fungsi untuk membersihkan pesan error
function clearError($field, $errorContainer) {
    $errorContainer.text('').hide();    // Sembunyikan teks error
    $field.removeClass('input-error'); // Hapus class error styling
}

// Fungsi validasi utama (logika disederhanakan)
function validateForm() {
    let isValid = true; // Anggap valid secara default

    // Validasi Nama Lengkap
    const namaVal = $nama.val().trim();
    const $namaError = $('#nama-error');
    clearError($nama, $namaError); // Selalu bersihkan error lama sebelum cek baru
    if (namaVal === '') {
        showError($nama, $namaError, 'Nama Lengkap wajib diisi.');
        isValid = false; // Jika kosong, form tidak valid
    }

    // Validasi Email
    const emailVal = $email.val().trim();
    const $emailError = $('#email-error');
    clearError($email, $emailError);
    if (emailVal === '') {
        showError($email, $emailError, 'Email wajib diisi.');
        isValid = false;
    } else if (emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1) {
        // Cek sederhana: harus ada '@' dan '.'
        showError($email, $emailError, 'Format email tidak valid.');
        isValid = false;
    }

    // Validasi Nomor Handphone
    const teleponVal = $telepon.val().trim();
    const $teleponError = $('#telepon-error');
    const phoneOnlyDigitsRegex = /^\+?\d+$/; // Regex: Boleh diawali '+' lalu hanya angka
    clearError($telepon, $teleponError);
    if (teleponVal === '') {
        showError($telepon, $teleponError, 'Nomor Handphone wajib diisi.');
        isValid = false;
    } else if (!phoneOnlyDigitsRegex.test(teleponVal)) {
        // Jika tidak cocok dengan pola angka (dan opsional +)
        showError($telepon, $teleponError, 'Nomor Handphone harus berupa angka.');
        isValid = false;
    }

    // Validasi Pesan
    const pesanVal = $pesan.val().trim();
    const $pesanError = $('#pesan-error');
    clearError($pesan, $pesanError);
    if (pesanVal === '') {
        showError($pesan, $pesanError, 'Pesan wajib diisi.');
        isValid = false;
    }

    return isValid; // Kembalikan status validasi (true atau false)
}

// Event handler ketika formulir di-submit
$contactForm.on('submit', function(event) {
    // ===> BARIS INI KRUSIAL UNTUK MENCEGAH REDIRECT <===
    event.preventDefault();

    // Bersihkan status umum (sukses/gagal) dari submit sebelumnya
    $formStatus.text('').removeClass('success error').hide();

    // Jalankan fungsi validasi
    if (validateForm()) {
        // --- Form valid ---
        // Tampilkan pesan proses, lalu simulasi pengiriman
        $formStatus.text('Mengirim data...').addClass('success').show();
        console.log('Form valid, data siap dikirim (gantilah dengan AJAX):');
        console.log({
            nama: $nama.val().trim(),
            email: $email.val().trim(),
            telepon: $telepon.val().trim(),
            pesan: $pesan.val().trim()
        });

        // --- PENTING: Ganti bagian ini dengan pengiriman data sesungguhnya (AJAX) ---
        // Simulasi delay jaringan dan respons sukses
        setTimeout(() => {
             $formStatus.text('Pesan Anda telah terkirim!').addClass('success').show();
             $contactForm[0].reset(); // Kosongkan formulir setelah sukses
             // Pastikan error styling juga hilang setelah reset
             $('.input-error').removeClass('input-error');
             $('.error-message').text('').hide();
        }, 1500);

    } else {
        // --- Form tidak valid ---
        // Fungsi validateForm() sudah menampilkan error di masing-masing field.
        // Tampilkan pesan error umum di bawah tombol submit.
        $formStatus.text('Terdapat kesalahan pada isian formulir. Mohon periksa kembali.').addClass('error').show();
        console.log('Form validation failed.');
        // Tidak ada redirect, browser tetap di halaman yang sama.
    }
});

// (Opsional) Hapus pesan error pada field saat pengguna mulai mengetik
$contactForm.find('input, textarea').on('input', function() {
    const $field = $(this);
    // Hanya hapus error jika field tersebut memang sedang error
    if ($field.hasClass('input-error')) {
        clearError($field, $field.siblings('.error-message'));
    }
    // Sembunyikan juga status umum jika user mulai mengedit lagi
    if ($formStatus.is(':visible')) {
         $formStatus.text('').removeClass('success error').hide();
    }
});

// ========== END CONTACT FORM VALIDATION ==========
}); 

