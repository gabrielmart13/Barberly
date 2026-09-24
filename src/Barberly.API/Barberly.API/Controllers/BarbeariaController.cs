using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeariaController : ControllerBase
    {
        private readonly DataContext _context;
        public BarbeariaController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Barbearia>> Get()
        {
            return new List<Barbearia>();
        }

        [HttpGet("{id}")]
        public ActionResult<Barbearia> Get(int id)
        {
            return new Barbearia();
        }

        [HttpPost]
        public ActionResult<Barbearia> Post(Barbearia barbearia)
        {
            return new Barbearia();
        }

        [HttpPut("{id}")]
        public ActionResult<Barbearia> Put(int id, Barbearia barbearia)
        {
            return new Barbearia();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
