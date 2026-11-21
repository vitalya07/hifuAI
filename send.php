<?php
// send.php — обработчик формы заявки SculptLínea

// Куда отправлять заявки
$RECIPIENT = 'info@sculptlinea.com';

// От кого (обязательно адрес на вашем домене)
$FROM = 'no-reply@sculptlinea.com';

header('Content-Type: application/json; charset=utf-8');

// Отвечаем только на POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Антиспам: скрытое поле-ловушка
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]); // боту отвечаем «успех», письмо не шлём
    exit;
}

function clean($s) {
    return trim(strip_tags($s ?? ''));
}

$name      = clean($_POST['name']      ?? '');
$phone     = clean($_POST['phone']     ?? '');
$treatment = clean($_POST['treatment'] ?? '');

// Простая валидация
if ($name === '' || mb_strlen($name) > 100) {
    echo json_encode(['ok' => false, 'error' => 'invalid_name']);
    exit;
}
if ($phone === '' || mb_strlen($phone) > 25) {
    echo json_encode(['ok' => false, 'error' => 'invalid_phone']);
    exit;
}
if ($treatment === '') {
    echo json_encode(['ok' => false, 'error' => 'invalid_treatment']);
    exit;
}

$subject = '=?UTF-8?B?' . base64_encode('Nueva solicitud — ' . $treatment) . '?=';

$message = "Nueva solicitud desde el sitio web sculptlinea.com\n\n"
         . "Nombre: $name\n"
         . "Teléfono: $phone\n"
         . "Tratamiento: $treatment\n"
         . "Fecha: " . date('d.m.Y H:i') . "\n";

$headers  = "From: SculptLínea Web <$FROM>\r\n";
$headers .= "Reply-To: $RECIPIENT\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($RECIPIENT, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed']);
}
