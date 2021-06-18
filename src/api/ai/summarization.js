/* eslint-disable*/

/**
 * textrank.js
 * @author 2020. 08. 13 gwkim<youlive789@gmail.com>
 * @description
 * 자카드 지수를 이용하여 텍스트 랭크 알고리즘을 단순하게 구현했습니다.
 * 교집합 연산시 연속된 두 글자가 포함되면 공통된 단어라고 인식시켰습니다.
 */

// 합집합 연산
Set.prototype.union = function (setB) {
  var union = new Set(this);
  for (var elem of setB) {
    union.add(elem);
  }
  return union;
};

// 교집합 연산 => 연속된 두 글자가 포함된다면 공통된 단어라고 인식
Set.prototype.intersection = function (setB) {
  var intersection = new Set();

  var thisArr = Array.from(this);
  var setBArr = Array.from(setB);

  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < setB.size; j++) {
      if (thisArr[i].indexOf(setBArr[j][0], setBArr[j][1], setBArr[j][2]) > -1)
        intersection.add(this[i]);
    }
  }
  return intersection;
};

/**
 * ProcessSentence
 *
 */
class ProcessSentence {
  constructor(sentence) {
    this.sentence = sentence;
  }

  _tokenize() {
    this.sentenceMetrics = this.sentence.slice();
  }

  getSentenceMetrics() {
    this._tokenize();
    return this.sentenceMetrics;
  }
}

/**
 * WeightMetrics
 */
class WeightMetrics {
  constructor(sentenceMetrics) {
    this.sentenceMetrics = sentenceMetrics;
    this.weightMetrics = new Array(sentenceMetrics.length)
      .fill(0)
      .map(() => new Array(sentenceMetrics.length).fill(0));
  }

  getWeightMetrics() {
    this._update();
    return this.weightMetrics;
  }

  _update() {
    var weightsLength = this.weightMetrics.length;
    for (var i = 0; i < weightsLength; i++) {
      for (var j = 0; j < weightsLength; j++) {
        var jaccardIndex = this._getJaccardIndex(
          this._splitSentence(this.sentenceMetrics[i]),
          this._splitSentence(this.sentenceMetrics[j])
        );
        if (!jaccardIndex) jaccardIndex = 0;
        this.weightMetrics[i][j] = jaccardIndex;
      }
    }
  }

  _getJaccardIndex(s1, s2) {
    var s1Set = new Set(s1);
    var s2Set = new Set(s2);
    var intersect = s1Set.intersection(s2Set);
    var union = s1Set.union(s2Set);
    return intersect.size / union.size;
  }

  _splitSentence(sentence) {
    return sentence.split(" ");
  }
}

/**
 * TextRank
 */
class TextRank {
  constructor(sentence) {
    this.ps = new ProcessSentence(sentence);
    this.weightMetrics = new WeightMetrics(this.ps.getSentenceMetrics());
    this.weights = this.weightMetrics.getWeightMetrics();
    this.score = new Float32Array(this.weights.length);

    this._initRanking();

    for (var i = 0; i < 20; i++) this._updateLoop();
  }

  getSummarizedText(n) {
    return this._top(n);
  }

  _initRanking() {
    var scoreLength = this.score.length;
    for (var i = 0; i < scoreLength; i++) {
      this.score[i] = 1 / scoreLength;
    }
  }

  _updateLoop() {
    var scoreLength = this.score.length;
    for (var i = 0; i < scoreLength; i++) {
      var tmp = 0;
      for (var j = 0; j < scoreLength; j++) {
        tmp += this.score[j] * this.weights[j][i];
      }
      this.score[i] = this.score[i] + tmp;
    }
  }

  _top(n) {
    var ranking = new Array(this.score.length).fill(1);
    for (var i = 0; i < this.score.length - 1; i++) {
      for (var j = i + 1; j < this.score.length; j++) {
        if (this.score[i] > this.score[j]) {
          ranking[j]++;
        } else {
          ranking[i]++;
        }
      }
    }

    var returnString = "";
    for (var i = 0; i < n; i++) {
      returnString += this.ps.sentence[i] + "\n";
    }

    return returnString;
  }
}
export default TextRank;
