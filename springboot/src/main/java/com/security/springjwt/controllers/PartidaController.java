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
public class PartidaController {
    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JuegoRepository juegoRepository;

    // 🔐 Solo ROLE_USER puede guardar una partida
    @PostMapping
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

        return partidaRepository.save(partida);  // Guardar la partida con los datos completos
    }

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
