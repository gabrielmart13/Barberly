using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicoController : ControllerBase
    {
        private readonly DataContext _context;
        public ServicoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Servico>> Get()
        {
            return new List<Servico>();
        }

        [HttpGet("{id}")]
        public ActionResult<Servico> Get(int id)
        {
            return new Servico();
        }

        [HttpPost]
        public ActionResult<Servico> Post(Servico servico)
        {
            return new Servico();
        }

        [HttpPut("{id}")]
        public ActionResult<Servico> Put(int id, Servico servico)
        {
            return new Servico();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
