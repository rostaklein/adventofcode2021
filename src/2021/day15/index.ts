import { readLinesFromAFile } from "../utils";

const fileLines = readLinesFromAFile("./day15/data.txt");

type Distances = Record<string, number>;
type Graph = Record<string, Distances>;
export class Chiton {
  private graph: Graph = {};
  constructor(private input: string[]) {
    this.makeGraph();
  }

  public run() {
    return this.findShortestPath("x0y0", "x9y9").distance;
  }

  private makeGraph() {
    let graph: Graph = {};
    this.input.forEach((line, y) => {
      line
        .split("")
        .map(Number)
        .forEach((_, x, arr) => {
          const currentKey = `x${x}y${y}`;
          const onTheRight = arr[x + 1];
          const below = Number(this.input[y + 1]?.split("")[x]);
          graph[currentKey] = {
            [`x${x + 1}y${y}`]: onTheRight,
            [`x${x}y${y + 1}`]: below,
          };
          this.removeUndefined(graph[currentKey]);
        });
    });

    this.graph = graph;
    // console.log(Object.keys(this.graph).length);
  }

  private removeUndefined(obj: Record<string, unknown>) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || Number.isNaN(obj[key])) {
        delete obj[key];
      }
    });
  }

  private shortestDistanceNode(distances: Distances, visited: string[]) {
    // create a default value for shortest
    let shortest = null;

    // for each node in the distances object
    for (let node in distances) {
      // console.log({node})
      // if no node has been assigned to shortest yet
      // or if the current node's distance is smaller than the current shortest
      let currentIsShortest =
        shortest === null || distances[node] < distances[shortest];

      // and if the current node is in the unvisited set
      if (currentIsShortest && !visited.includes(node)) {
        // update shortest to be the current node
        shortest = node;
      }
    }
    return shortest;
  }

  private findShortestPath(startNode: string, endNode: string) {
    const graph = this.graph;
    // track distances from the start node using a hash object
    let distances: Distances = {};
    distances[endNode] = Infinity;
    distances = Object.assign(distances, graph[startNode]);
    // track paths using a hash object
    let parents: Record<string, string | null> = { endNode: null };
    for (let child in graph[startNode]) {
      parents[child] = startNode;
    }

    // collect visited nodes
    let visited: string[] = [];
    // find the nearest node
    let node = this.shortestDistanceNode(distances, visited);

    // for that node:
    while (node) {
      // find its distance from the start node & its child nodes
      let distance = distances[node];
      let children = graph[node];

      // console.log({ children });
      // for each of those child nodes:
      for (let child in children) {
        // make sure each child node is not the start node
        if (String(child) === String(startNode)) {
          continue;
        } else {
          // save the distance from the start node to the child node
          let newDistance = distance + children[child];
          // if there's no recorded distance from the start node to the child node in the distances object
          // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
          if (!distances[child] || distances[child] > newDistance) {
            // save the distance to the object
            distances[child] = newDistance;
            // record the path
            parents[child] = node;
          }
        }
      }
      // move the current node to the visited set
      visited.push(node);
      // move to the nearest neighbor node
      node = this.shortestDistanceNode(distances, visited);
    }

    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
      shortestPath.push(parent);
      parent = parents[parent];
    }
    shortestPath.reverse();

    //this is the shortest path
    let results = {
      distance: distances[endNode],
      path: shortestPath,
    };
    // return the shortest path & the end node's distance from the start node
    return results;
  }
}

export const main = () => {
  console.time(Chiton.name);
  const calc = new Chiton(fileLines);
  const result = calc.run();
  console.timeEnd(Chiton.name);
  return result;
};
