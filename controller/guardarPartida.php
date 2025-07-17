<?php
require_once '../config/database.php';
require_once '../data/usuarioDB.php';

header('Content-Type: application/json');

$response = ['success' => false, 'mensaje' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $usuarioDB = new UsuarioDB($database);

    // Obtener los datos del cuerpo de la solicitud JSON
    $input = json_decode(file_get_contents('php://input'), true);

    $id_usuario = $input['id_usuario'] ?? null;
    $modo_juego = $input['modo_juego'] ?? null;
    $puntuacion_final = $input['puntuacion_final'] ?? null;
    $tiempo_restante_final = $input['tiempo_restante_final'] ?? null;
    $pistas_usadas = $input['pistas_usadas'] ?? 0;
    $resultado = $input['resultado'] ?? 0; // 0 para incompleta/perdida, 1 para completada/ganada

    // Validar datos básicos
    if ($id_usuario === null || $modo_juego === null) {
        $response['mensaje'] = 'Datos incompletos para guardar la partida.';
    } else {
        // Asegurarse de que solo uno de los campos de resultado (puntuacion o tiempo) tenga valor
        if ($modo_juego === 'score') {
            $tiempo_restante_final = null;
        } else if ($modo_juego === 'time') {
            $puntuacion_final = null;
        }

        $result = $usuarioDB->guardarPartida(
            $id_usuario,
            $modo_juego,
            $puntuacion_final,
            $tiempo_restante_final,
            $pistas_usadas,
            $resultado
        );

        $response = $result;
    }
} else {
    $response['mensaje'] = 'Método de solicitud no permitido.';
}

echo json_encode($response);
?>