package com.security.springjwt.controllers;

import com.security.springjwt.models.Juego;
import com.security.springjwt.models.Partida;
import com.security.springjwt.models.User;
import com.security.springjwt.repository.JuegoRepository;
import com.security.springjwt.repository.PartidaRepository;
import com.security.springjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/partidas")
@CrossOrigin(origins = "http://localhost:8081") // permite CORS solo para este controlador*/
public class PartidaController {
    @Autowired
    private PartidaRepository partidaRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JuegoRepository juegoRepository;



    /*
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Partida guardarPartida(@RequestBody Partida partida, Principal principal) {
        String username = principal.getName();
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Juego juego = null;

        if (partida.getJuego() != null && partida.getJuego().getId() != null) {
            // Intentar buscar el juego por ID
            juego = juegoRepository.findById(partida.getJuego().getId()).orElse(null);
            if (juego != null && partida.getJuego().getNombre() != null) {
                // Actualizar el nombre si es diferente
                juego.setNombre(partida.getJuego().getNombre());
                juego = juegoRepository.save(juego);
            }
        }

        if (juego == null) {
            // Si no existe, crear nuevo juego con los datos proporcionados
            juego = new Juego();
            juego.setNombre(partida.getJuego().getNombre());
            juego.setDescripcion(partida.getJuego().getDescripcion());
            juego = juegoRepository.save(juego);
        }

        // Asignar usuario, juego y fecha
        partida.setUsuario(usuario);
        partida.setJuego(juego);
        partida.setFecha(LocalDateTime.now());
        partida.setNombreJuego(juego.getNombre());
        System.out.println("Nombre del juego: " + partida.getNombreJuego());

        return partidaRepository.save(partida);
    }
*/
























    // 🔐 Solo ROLE_USER puede guardar una partida
    //nuevo de chat
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Partida guardarPartida(@RequestBody Partida partida, Principal principal) {
        String username = principal.getName();
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Juego juego = null;

        if (partida.getJuego() != null && partida.getJuego().getId() != null) {
            // Intentar buscar el juego por ID
            juego = juegoRepository.findById(partida.getJuego().getId()).orElse(null);
        }

        if (juego == null) {
            // Si no existe, crear nuevo juego con los datos proporcionados
            juego = new Juego();
            juego.setNombre(partida.getJuego().getNombre());
            juego.setDescripcion(partida.getJuego().getDescripcion());
            juego = juegoRepository.save(juego);
        }

        // Asignar usuario, juego y fecha
        partida.setUsuario(usuario);
        partida.setJuego(juego);
        partida.setFecha(LocalDateTime.now());
        partida.setNombreJuego(juego.getNombre());
System.out.println("Nombre del juego: " + partida.getNombreJuego());
        // Guardar la partida
        juego.setNombre(partida.getJuego().getNombre());
        return partidaRepository.save(partida);
    }




    // 🔐 Solo ROLE_USER puede guardar una partida
    /*@PostMapping
    @PreAuthorize("hasRole('USER')")
    public Partida guardarPartida(@RequestBody Partida partida, Principal principal) {
        String username = principal.getName();
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Juego juego = juegoRepository.findById(partida.getJuego().getId())
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        partida.setUsuario(usuario);
        partida.setJuego(juego);
        partida.setFecha(LocalDateTime.now());

        // Asignar los valores de cantidadErrores, cantidadIntentos, tiempoSegundos
        partida.setCantidadErrores(partida.getCantidadErrores());
        partida.setCantidadIntentos(partida.getCantidadIntentos());
        partida.setTiempoSegundos(partida.getTiempoSegundos());
        partida.setAciertos(partida.getAciertos());

        return partidaRepository.save(partida);  // Guardar la partida con los datos completos
    }*/

    @GetMapping("/mis-resultados")
    @PreAuthorize("hasRole('USER')")
    public List<Partida> obtenerMisPartidas(Principal principal) {
        String username = principal.getName();
        User usuario = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return partidaRepository.findByUsuario(usuario);
    }

    @GetMapping("/usuario/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<Partida> obtenerPartidasDeUsuario(@PathVariable Long id) {
        User usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return partidaRepository.findByUsuario(usuario);
    }

    @GetMapping("/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Partida> obtenerTodasLasPartidas() {
        return partidaRepository.findAll();
    }
}
