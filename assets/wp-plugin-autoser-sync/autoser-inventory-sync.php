<?php
/**
 * Plugin Name: Autoser Inventory Sync
 * Plugin URI: https://autoservallarta.com
 * Description: Sincroniza en tiempo real el inventario de autos desde WordPress hacia un webhook de n8n / Convex para alimentar el asistente de IA con datos 100% reales de ACF.
 * Version: 1.1.0
 * Author: Antigravity AI
 * Author URI: https://autoservallarta.com
 * License: GPL2
 */

// Evitar acceso directo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Inicializar la página de ajustes
add_action( 'admin_menu', 'autoser_sync_menu' );
add_action( 'admin_init', 'autoser_sync_settings_init' );

function autoser_sync_menu() {
    add_options_page(
        'Autoser Inventory Sync',
        'Autoser Sync',
        'manage_options',
        'autoser-sync',
        'autoser_sync_settings_page'
    );
}

function autoser_sync_settings_init() {
    register_setting( 'autoser_sync_group', 'autoser_sync_webhook_url' );
    register_setting( 'autoser_sync_group', 'autoser_sync_token' );
    register_setting( 'autoser_sync_group', 'autoser_sync_post_type', array(
        'default' => 'seminuevo'
    ) );
    
    // Mapeo de campos personalizados (Meta Keys preconfigurados con tus ACF exactos)
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_price', array( 'default' => 'precio' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_mileage', array( 'default' => 'kilometraje' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_year', array( 'default' => 'a_o' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_brand', array( 'default' => 'marca' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_model', array( 'default' => 'modelo' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_transmission', array( 'default' => 'transmision' ) );
    register_setting( 'autoser_sync_group', 'autoser_sync_meta_featured', array( 'default' => 'destacado' ) );
}

function autoser_sync_settings_page() {
    ?>
    <div class="wrap">
        <h1>⚙️ Autoser Inventory Sync (v1.1.0 - ACF Optimized)</h1>
        <p>Sincronización en tiempo real con tu base de datos central. Preconfigurado para tu grupo de campos <strong>Seminuevos</strong> de ACF.</p>
        
        <form method="post" action="options.php">
            <?php settings_fields( 'autoser_sync_group' ); ?>
            <?php do_settings_sections( 'autoser_sync_group' ); ?>
            
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Webhook URL (n8n / Convex)</th>
                    <td>
                        <input type="text" name="autoser_sync_webhook_url" value="<?php echo esc_attr( get_option('autoser_sync_webhook_url') ); ?>" class="large-text" placeholder="https://n8n.orbys.one/webhook/... o https://...convex.site/..." />
                        <p class="description">URL a la que se enviará el payload JSON con la información del vehículo.</p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Token Secreto de Seguridad</th>
                    <td>
                        <input type="text" name="autoser_sync_token" value="<?php echo esc_attr( get_option('autoser_sync_token') ); ?>" class="regular-text" placeholder="un_token_secreto_seguro" />
                        <p class="description">Token enviado en el Header `Authorization: Bearer <token>` para validar la procedencia en n8n.</p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Post Type del Inventario</th>
                    <td>
                        <input type="text" name="autoser_sync_post_type" value="<?php echo esc_attr( get_option('autoser_sync_post_type', 'seminuevo') ); ?>" class="regular-text" />
                        <p class="description">El tipo de contenido usado para los autos (ej: <code>seminuevo</code>).</p>
                    </td>
                </tr>
                
                <tr>
                    <td colspan="2"><hr><h3>🔍 Mapeo de Custom Fields (Meta Keys de WordPress / ACF)</h3>
                    <p class="description">Valores por defecto cargados con los slugs técnicos de tu grupo de campos ACF.</p></td>
                </tr>
                
                <tr valign="top">
                    <th scope="row">Meta Key de Precio</th>
                    <td><input type="text" name="autoser_sync_meta_price" value="<?php echo esc_attr( get_option('autoser_sync_meta_price', 'precio') ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Kilometraje</th>
                    <td><input type="text" name="autoser_sync_meta_mileage" value="<?php echo esc_attr( get_option('autoser_sync_meta_mileage', 'kilometraje') ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Año</th>
                    <td><input type="text" name="autoser_sync_meta_year" value="<?php echo esc_attr( get_option('autoser_sync_meta_year', 'a_o') ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Marca</th>
                    <td><input type="text" name="autoser_sync_meta_brand" value="<?php echo esc_attr( get_option('autoser_sync_meta_brand', 'marca') ); ?>" class="regular-text" /><p class="description">Es de tipo taxonomía. El plugin extraerá el término asignado de forma inteligente si es necesario.</p></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Modelo (Opcional)</th>
                    <td><input type="text" name="autoser_sync_meta_model" value="<?php echo esc_attr( get_option('autoser_sync_meta_model', 'modelo') ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Transmisión</th>
                    <td><input type="text" name="autoser_sync_meta_transmission" value="<?php echo esc_attr( get_option('autoser_sync_meta_transmission', 'transmision') ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Meta Key de Unidad Destacada</th>
                    <td><input type="text" name="autoser_sync_meta_featured" value="<?php echo esc_attr( get_option('autoser_sync_meta_featured', 'destacado') ); ?>" class="regular-text" /><p class="description">Campo ACF (True/False) usado para marcar si el auto se debe mostrar en "Unidades Destacadas" del Home (ej: <code>destacado</code>).</p></td>
                </tr>
            </table>
            
            <?php submit_button(); ?>
        </form>
        
        <hr>
        
        <h2>⚡ Sincronización Manual Masiva</h2>
        <p>Haz clic en este botón para exportar <strong>todo tu inventario publicado actualmente</strong> hacia la base de datos de manera masiva.</p>
        
        <form method="post" action="">
            <input type="hidden" name="autoser_bulk_sync_trigger" value="1">
            <?php submit_button('Sincronizar Todo el Inventario Ahora', 'secondary', 'bulk_sync_submit'); ?>
        </form>
        
        <?php
        if ( isset($_POST['autoser_bulk_sync_trigger']) ) {
            autoser_trigger_bulk_sync();
        }
        ?>
    </div>
    <?php
}

// ----------------------------------------------------
// LÓGICA DE EXTRACCIÓN Y CONSTRUCCIÓN DEL PAYLOAD JSON
// ----------------------------------------------------
function autoser_get_vehicle_payload( $post_id, $status_override = null ) {
    $post = get_post( $post_id );
    if ( !$post ) return null;
    
    // Obtener imagen destacada (si la hay)
    $featured_image = get_the_post_thumbnail_url( $post_id, 'full' );
    
    // Obtener galería ACF ("galeria")
    $gallery = array();
    $acf_gallery = get_post_meta( $post_id, 'galeria', true );
    if ( is_array($acf_gallery) ) {
        foreach ( $acf_gallery as $img ) {
            $gallery[] = is_numeric($img) ? wp_get_attachment_url($img) : $img;
        }
    }
    
    // Si no hay imagen destacada, tomar la primera de la galería ACF como fallback
    if ( empty($featured_image) && !empty($gallery) ) {
        $featured_image = $gallery[0];
    }

    // Mapear campos técnicos principales configurables
    $price_key        = get_option('autoser_sync_meta_price', 'precio');
    $mileage_key      = get_option('autoser_sync_meta_mileage', 'kilometraje');
    $year_key         = get_option('autoser_sync_meta_year', 'a_o');
    $brand_key        = get_option('autoser_sync_meta_brand', 'marca');
    $model_key        = get_option('autoser_sync_meta_model', 'modelo');
    $transmission_key = get_option('autoser_sync_meta_transmission', 'transmision');

    $price        = get_post_meta( $post_id, $price_key, true );
    $mileage      = get_post_meta( $post_id, $mileage_key, true );
    $year         = get_post_meta( $post_id, $year_key, true );
    $brand        = get_post_meta( $post_id, $brand_key, true );
    $model        = get_post_meta( $post_id, $model_key, true );
    $transmission = get_post_meta( $post_id, $transmission_key, true );

    // Lógica avanzada para campos tipo taxonomía (como marca) de ACF
    if ( empty($brand) || is_numeric($brand) || is_array($brand) ) {
        // En ACF, el campo de tipo Taxonomía a veces devuelve un ID de término, un Objeto de término o un Array de IDs.
        $term_id = is_array($brand) ? $brand[0] : $brand;
        if ( is_numeric($term_id) ) {
            $term = get_term( $term_id );
            if ( $term && !is_wp_error($term) ) {
                $brand = $term->name;
            }
        } else {
            // Fallback: intentar buscar directamente las taxonomías asociadas
            $brands_tax = wp_get_post_terms( $post_id, 'marca' );
            if ( !is_wp_error($brands_tax) && !empty($brands_tax) ) {
                $brand = $brands_tax[0]->name;
            }
        }
    }

    // Extracción de todos tus campos específicos ACF según la captura de pantalla:
    $color                     = get_post_meta( $post_id, 'color', true );
    $color_interior            = get_post_meta( $post_id, 'color_interior', true );
    $carroceria                = get_post_meta( $post_id, 'carroceria', true );
    $puertas                   = get_post_meta( $post_id, 'puertas', true );
    $cilindros                 = get_post_meta( $post_id, 'cilindros', true );
    $subtitulo                 = get_post_meta( $post_id, 'subtitulo', true );
    $precio_especial           = get_post_meta( $post_id, 'precio_especial', true );
    $enganche                  = get_post_meta( $post_id, 'enganche', true );
    $plazo                     = get_post_meta( $post_id, 'plazo', true );
    $tipo_motor                = get_post_meta( $post_id, 'tipo_motor', true );
    
    // Campo tipo check-box de características
    $caracteristicas           = get_post_meta( $post_id, 'caracteristicas', true );
    if ( is_array($caracteristicas) ) {
        $caracteristicas = implode( ', ', $caracteristicas );
    }

    $informacion_financiamiento = get_post_meta( $post_id, 'informacion-financiamiento', true );
    
    // Obtener archivo de Ficha Técnica
    $ficha_id                  = get_post_meta( $post_id, 'ficha_tecnica', true );
    $ficha_url                 = is_numeric($ficha_id) ? wp_get_attachment_url($ficha_id) : $ficha_id;

    // Determinar estatus final
    $status = $status_override ? $status_override : ( $post->post_status === 'publish' ? 'active' : 'inactive' );

    return array(
        'id'             => $post_id,
        'title'          => html_entity_decode($post->post_title),
        'permalink'      => get_permalink( $post_id ),
        'status'         => $status,
        'description'    => strip_tags(strip_shortcodes($post->post_content)),
        'featured_image' => $featured_image ? $featured_image : '',
        'gallery_images' => array_values(array_filter($gallery)),
        
        // Datos Técnicos Mapeados
        'price'          => $price ? floatval(preg_replace('/[^0-9.]/', '', $price)) : null,
        'mileage'        => $mileage ? intval(preg_replace('/[^0-9]/', '', $mileage)) : null,
        'year'           => $year ? intval(preg_replace('/[^0-9]/', '', $year)) : null,
        'brand'          => $brand ? trim($brand) : '',
        'model'          => $model ? trim($model) : '',
        'transmission'   => $transmission ? trim($transmission) : '',
        
        // Campos ACF Personalizados Adicionales (Captura de pantalla)
        'color'             => $color ? trim($color) : '',
        'color_interior'    => $color_interior ? trim($color_interior) : '',
        'carroceria'        => $carroceria ? trim($carroceria) : '',
        'puertas'           => $puertas ? intval($puertas) : null,
        'cilindros'         => $cilindros ? intval($cilindros) : null,
        'subtitulo'         => $subtitulo ? trim($subtitulo) : '',
        'price_special'     => $precio_especial ? floatval(preg_replace('/[^0-9.]/', '', $precio_especial)) : null,
        'downpayment'       => $enganche ? trim($enganche) : '',
        'financing_term'    => $plazo ? trim($plazo) : '',
        'engine_type'       => $tipo_motor ? trim($tipo_motor) : '',
        'features'          => $caracteristicas ? trim($caracteristicas) : '',
        'financing_info'    => $informacion_financiamiento ? trim($informacion_financiamiento) : '',
        'technical_sheet'   => $ficha_url ? $ficha_url : '',
        'date_modified'     => $post->post_modified,
    );
}

// ----------------------------------------------------
// ENVÍO DE DATOS AL WEBHOOK
// ----------------------------------------------------
function autoser_send_payload_to_webhook( $payload ) {
    $webhook_url = get_option('autoser_sync_webhook_url');
    $token = get_option('autoser_sync_token');
    
    if ( empty($webhook_url) ) {
        return false;
    }
    
    $headers = array(
        'Content-Type' => 'application/json; charset=utf-8',
    );
    
    if ( !empty($token) ) {
        $headers['Authorization'] = 'Bearer ' . $token;
    }
    
    $args = array(
        'body'        => wp_json_encode( $payload ),
        'headers'     => $headers,
        'timeout'     => 15,
        'data_format' => 'body'
    );
    
    $response = wp_remote_post( $webhook_url, $args );
    
    if ( is_wp_error( $response ) ) {
        error_log( 'Autoser Sync Error: ' . $response->get_error_message() );
        return false;
    }
    
    return true;
}

// ----------------------------------------------------
// HOOKS DE DISPARO EN TIEMPO REAL
// ----------------------------------------------------
add_action( 'transition_post_status', 'autoser_sync_on_post_transition', 10, 3 );
function autoser_sync_on_post_transition( $new_status, $old_status, $post ) {
    $target_post_type = get_option('autoser_sync_post_type', 'seminuevo');
    
    if ( $post->post_type !== $target_post_type ) {
        return;
    }
    
    // Ignorar revisiones y auto-guardados
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    
    // Si se publica o se actualiza estando publicado
    if ( $new_status === 'publish' ) {
        $payload = autoser_get_vehicle_payload( $post->ID, 'active' );
        if ( $payload ) {
            autoser_send_payload_to_webhook( $payload );
        }
    } 
    // Si estaba publicado pero pasa a borrador o papelera
    elseif ( $old_status === 'publish' && $new_status !== 'publish' ) {
        $payload = array(
            'id'     => $post->ID,
            'status' => 'inactive',
            'action' => 'delete'
        );
        autoser_send_payload_to_webhook( $payload );
    }
}

// Escuchar antes de eliminar permanentemente un post
add_action( 'before_delete_post', 'autoser_sync_on_post_delete' );
function autoser_sync_on_post_delete( $post_id ) {
    $post = get_post( $post_id );
    $target_post_type = get_option('autoser_sync_post_type', 'seminuevo');
    
    if ( $post && $post->post_type === $target_post_type ) {
        $payload = array(
            'id'     => $post_id,
            'status' => 'inactive',
            'action' => 'delete'
        );
        autoser_send_payload_to_webhook( $payload );
    }
}

// ----------------------------------------------------
// EXPORTACIÓN MASIVA (BULK SYNC)
// ----------------------------------------------------
function autoser_trigger_bulk_sync() {
    $target_post_type = get_option('autoser_sync_post_type', 'seminuevo');
    
    $args = array(
        'post_type'      => $target_post_type,
        'post_status'    => 'publish',
        'posts_per_page' => -1,
    );
    
    $query = new WP_Query( $args );
    $vehicles = $query->posts;
    
    if ( empty($vehicles) ) {
        echo '<div class="notice notice-warning is-dismissible"><p>⚠️ No se encontraron unidades publicadas para el CPT: <strong>' . esc_html($target_post_type) . '</strong></p></div>';
        return;
    }
    
    $count = 0;
    $errors = 0;
    
    foreach ( $vehicles as $vehicle ) {
        $payload = autoser_get_vehicle_payload( $vehicle->ID, 'active' );
        if ( $payload ) {
            $payload['is_bulk_sync'] = true;
            $success = autoser_send_payload_to_webhook( $payload );
            if ( $success ) {
                $count++;
            } else {
                $errors++;
            }
        }
    }
    
    if ( $errors === 0 ) {
        echo '<div class="notice notice-success is-dismissible"><p>✅ ¡Sincronización masiva exitosa! Se enviaron <strong>' . $count . '</strong> unidades correctamente a tu webhook.</p></div>';
    } else {
        echo '<div class="notice notice-warning is-dismissible"><p>⚠️ Sincronización masiva completada parcialmente. <strong>' . $count . '</strong> unidades enviadas con éxito, <strong>' . $errors . '</strong> fallaron. Revisa los logs de WordPress o n8n.</p></div>';
    }
}

// ----------------------------------------------------
// ENDPOINT REST API PARA UNIDADES DESTACADAS (HOME)
// ----------------------------------------------------
add_action( 'rest_api_init', function () {
    register_rest_route( 'autoser/v1', '/featured', array(
        'methods'             => 'GET',
        'callback'            => 'autoser_get_featured_endpoint',
        'permission_callback' => '__return_true',
    ) );
} );

function autoser_get_featured_endpoint() {
    $target_post_type = get_option('autoser_sync_post_type', 'seminuevo');
    $featured_key     = get_option('autoser_sync_meta_featured', 'destacado');
    
    $args = array(
        'post_type'      => $target_post_type,
        'post_status'    => 'publish',
        'posts_per_page' => 8,
        'meta_query'     => array(
            array(
                'key'     => $featured_key,
                'value'   => '1',
                'compare' => '='
            )
        )
    );
    
    // Fallback: Si no hay autos marcados como destacados, obtener los últimos 8 publicados
    $query = new WP_Query( $args );
    if ( !$query->have_posts() ) {
        unset($args['meta_query']);
        $query = new WP_Query( $args );
    }
    
    $featured = array();
    foreach ( $query->posts as $post ) {
        $payload = autoser_get_vehicle_payload( $post->ID );
        if ( $payload ) {
            // Formatear specs en ES y EN
            $mileage_formatted = number_format($payload['mileage']) . ' km';
            $trans_es = $payload['transmission'];
            $trans_en = (stripos($trans_es, 'manual') !== false) ? 'Manual' : 'Automatic';
            
            // Formatear tag en ES y EN
            $tag_es = $payload['carroceria'] ? $payload['carroceria'] : 'Seminuevo';
            $tag_en = $payload['carroceria'] ? $payload['carroceria'] : 'Pre-owned';
            if (strtolower($tag_es) === 'suv') {
                $tag_es = 'SUV';
                $tag_en = 'SUV';
            }
            
            $price_val = isset($payload['price']) ? floatval($payload['price']) : 0;
            $price_special_val = isset($payload['price_special']) ? floatval($payload['price_special']) : 0;

            $featured[] = array(
                'id'            => $payload['id'],
                'title'         => $payload['title'],
                'year'          => (string)$payload['year'],
                'price'         => '$' . number_format($price_val),
                'price_special' => $price_special_val > 0 ? '$' . number_format($price_special_val) : null,
                'specs'         => $mileage_formatted . ' • ' . $trans_es,
                'specs_en'      => $mileage_formatted . ' • ' . $trans_en,
                'tag'           => $tag_es,
                'tag_en'        => $tag_en,
                'image'         => $payload['featured_image'],
                'url'           => $payload['permalink']
            );
        }
    }
    
    $response = new WP_REST_Response( $featured, 200 );
    $response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
    $response->header( 'Pragma', 'no-cache' );
    $response->header( 'Expires', 'Thu, 01 Jan 1970 00:00:00 GMT' );
    return $response;
}
