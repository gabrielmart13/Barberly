using Barberly.API.Data;
using Barberly.API.Domain.DTOs.BarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Org.BouncyCastle.Asn1.Ocsp;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeariaController : ControllerBase
    {
        private readonly IBarbeariaService _barbeariaService;
        public BarbeariaController(IBarbeariaService barbeariaService)
        {
            _barbeariaService = barbeariaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Barbearia>>> Get()
        {
            var barbearias = await _barbeariaService.PegarBarbeariasAsync();
            return Ok(barbearias);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Barbearia>> Get(int id)
        {
            var barbearia = await _barbeariaService.PegarBarbeariaAsync(id);

            return Ok(barbearia);
        }

        [HttpPost]
        public async Task<ActionResult<Barbearia>> Post(CriarBarbeariaRequest request)
        {
            Barbearia barbearia = new Barbearia
            {
                Nome = request.Nome,
                Endereco = request.Endereco,
                Contato = request.Contato,
                Descricao = request.Descricao,
                IdDonoBarbearia = request.IdDonoBarbearia
            };
            await _barbeariaService.CriarBarbeariaAsync(barbearia);
            return Ok(barbearia);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Barbearia>> Put(int id, AtualizarBarbeariaRequest request)
        {
            Barbearia barbearia = new Barbearia
            {
                Nome = request.Nome,
                Endereco = request.Endereco,
                Contato = request.Contato,
                Descricao = request.Descricao,
                IdDonoBarbearia = request.IdDonoBarbearia
            };
            await _barbeariaService.AtualizarBarbeariaAsync(id,barbearia);
            return Ok(barbearia);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _barbeariaService.DeletarBarbeariaAsync(id));
        }
    }
}
